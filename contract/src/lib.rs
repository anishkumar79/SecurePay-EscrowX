#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Counter,
    Escrow(u64),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EscrowAgreement {
    pub client: Address,
    pub freelancer: Address,
    pub token: Address,
    pub amount: i128,
    pub release_time: u64,
    pub status: u32, // 0 = Created, 1 = Deposited, 2 = ReleaseRequested, 3 = Released, 4 = Refunded
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        token: Address,
        amount: i128,
        release_time: u64,
    ) -> u64 {
        client.require_auth();

        let mut counter: u64 = env.storage().instance().get(&DataKey::Counter).unwrap_or(0);
        counter += 1;
        env.storage().instance().set(&DataKey::Counter, &counter);

        let agreement = EscrowAgreement {
            client: client.clone(),
            freelancer: freelancer.clone(),
            token: token.clone(),
            amount,
            release_time,
            status: 0,
        };

        let key = DataKey::Escrow(counter);
        env.storage().persistent().set(&key, &agreement);

        env.events().publish(
            (Symbol::new(&env, "create_escrow"), counter),
            (client, freelancer, token, amount, release_time),
        );

        counter
    }

    pub fn deposit(env: Env, escrow_id: u64) {
        let key = DataKey::Escrow(escrow_id);
        let mut escrow: EscrowAgreement = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Escrow not found");

        assert_eq!(escrow.status, 0, "Escrow is not in Created state");

        escrow.client.require_auth();

        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(
            &escrow.client,
            &env.current_contract_address(),
            &escrow.amount,
        );

        escrow.status = 1;
        env.storage().persistent().set(&key, &escrow);

        env.events().publish(
            (Symbol::new(&env, "deposit"), escrow_id),
            (escrow.client.clone(), escrow.amount),
        );
    }

    pub fn request_release(env: Env, escrow_id: u64) {
        let key = DataKey::Escrow(escrow_id);
        let mut escrow: EscrowAgreement = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Escrow not found");

        assert_eq!(escrow.status, 1, "Escrow must be in Deposited state");

        escrow.freelancer.require_auth();

        escrow.status = 2;
        env.storage().persistent().set(&key, &escrow);

        env.events().publish(
            (Symbol::new(&env, "request_release"), escrow_id),
            escrow.freelancer.clone(),
        );
    }

    pub fn approve_release(env: Env, escrow_id: u64) {
        let key = DataKey::Escrow(escrow_id);
        let mut escrow: EscrowAgreement = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Escrow not found");

        assert!(
            escrow.status == 1 || escrow.status == 2,
            "Escrow must be Deposited or ReleaseRequested"
        );

        escrow.client.require_auth();

        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.freelancer,
            &escrow.amount,
        );

        escrow.status = 3;
        env.storage().persistent().set(&key, &escrow);

        env.events().publish(
            (Symbol::new(&env, "approve_release"), escrow_id),
            escrow.freelancer.clone(),
        );
    }

    pub fn refund(env: Env, escrow_id: u64, caller: Address) {
        let key = DataKey::Escrow(escrow_id);
        let mut escrow: EscrowAgreement = env
            .storage()
            .persistent()
            .get(&key)
            .expect("Escrow not found");

        assert_eq!(escrow.status, 1, "Escrow must be Deposited to refund");

        caller.require_auth();
        assert!(
            caller == escrow.client || caller == escrow.freelancer,
            "Caller is not authorized"
        );

        if caller == escrow.client {
            let current_time = env.ledger().timestamp();
            assert!(
                current_time >= escrow.release_time,
                "Release time has not passed yet"
            );
        }

        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(
            &env.current_contract_address(),
            &escrow.client,
            &escrow.amount,
        );

        escrow.status = 4;
        env.storage().persistent().set(&key, &escrow);

        env.events().publish(
            (Symbol::new(&env, "refund"), escrow_id),
            escrow.client.clone(),
        );
    }

    pub fn get_escrow(env: Env, escrow_id: u64) -> Option<EscrowAgreement> {
        let key = DataKey::Escrow(escrow_id);
        env.storage().persistent().get(&key)
    }

    pub fn get_counter(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::Counter).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};
    use soroban_sdk::token::{Client as TokenClient, StellarAssetClient};

    fn create_token<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
        let contract_address = env.register_stellar_asset_contract(admin.clone());
        let client = TokenClient::new(env, &contract_address);
        let stellar_asset_client = StellarAssetClient::new(env, &contract_address);
        (client, stellar_asset_client)
    }

    #[test]
    fn test_escrow_workflow() {
        let env = Env::default();
        env.mock_all_auths();

        let client = Address::generate(&env);
        let freelancer = Address::generate(&env);
        let token_admin = Address::generate(&env);

        let (token, token_client) = create_token(&env, &token_admin);
        token_client.mint(&client, &1000);

        let contract_id = env.register(EscrowContract, ());
        let client_contract = EscrowContractClient::new(&env, &contract_id);

        let release_time = 1000;
        let escrow_id = client_contract.create_escrow(
            &client,
            &freelancer,
            &token.address,
            &500,
            &release_time,
        );

        assert_eq!(escrow_id, 1);

        let agreement = client_contract.get_escrow(&escrow_id).unwrap();
        assert_eq!(agreement.status, 0);
        assert_eq!(agreement.amount, 500);

        client_contract.deposit(&escrow_id);
        assert_eq!(token.balance(&client), 500);
        assert_eq!(token.balance(&contract_id), 500);
        assert_eq!(client_contract.get_escrow(&escrow_id).unwrap().status, 1);

        client_contract.request_release(&escrow_id);
        assert_eq!(client_contract.get_escrow(&escrow_id).unwrap().status, 2);

        client_contract.approve_release(&escrow_id);
        assert_eq!(token.balance(&freelancer), 500);
        assert_eq!(token.balance(&contract_id), 0);
        assert_eq!(client_contract.get_escrow(&escrow_id).unwrap().status, 3);
    }

    #[test]
    fn test_refund_by_freelancer() {
        let env = Env::default();
        env.mock_all_auths();

        let client = Address::generate(&env);
        let freelancer = Address::generate(&env);
        let token_admin = Address::generate(&env);

        let (token, token_client) = create_token(&env, &token_admin);
        token_client.mint(&client, &1000);

        let contract_id = env.register(EscrowContract, ());
        let client_contract = EscrowContractClient::new(&env, &contract_id);

        let escrow_id = client_contract.create_escrow(
            &client,
            &freelancer,
            &token.address,
            &500,
            &1000,
        );

        client_contract.deposit(&escrow_id);
        client_contract.refund(&escrow_id, &freelancer);

        assert_eq!(token.balance(&client), 1000);
        assert_eq!(client_contract.get_escrow(&escrow_id).unwrap().status, 4);
    }

    #[test]
    fn test_refund_by_client_after_expiry() {
        let env = Env::default();
        env.mock_all_auths();

        let client = Address::generate(&env);
        let freelancer = Address::generate(&env);
        let token_admin = Address::generate(&env);

        let (token, token_client) = create_token(&env, &token_admin);
        token_client.mint(&client, &1000);

        let contract_id = env.register(EscrowContract, ());
        let client_contract = EscrowContractClient::new(&env, &contract_id);

        let escrow_id = client_contract.create_escrow(
            &client,
            &freelancer,
            &token.address,
            &500,
            &1000,
        );

        client_contract.deposit(&escrow_id);

        env.ledger().set_timestamp(1001);
        client_contract.refund(&escrow_id, &client);

        assert_eq!(token.balance(&client), 1000);
        assert_eq!(client_contract.get_escrow(&escrow_id).unwrap().status, 4);
    }
}
