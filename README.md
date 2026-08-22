# 🚀 SecurePay: EscrowX — Secure Freelance Payments on Stellar

SecurePay: EscrowX is a decentralized, transparent, and low-cost freelance payment protection escrow application built on the Stellar network using Soroban smart contracts. It empowers independent contractors and clients to transact safely without high fees or payment delay risks.

## 🔗 Live Demo & Links
- **Live Platform**: [https://secure-pay-escrow-x.vercel.app/](https://secure-pay-escrow-x.vercel.app/)
- **Demo Video**: [Watch the SecurePay: EscrowX Walkthrough](https://youtu.be/mR9KDsVQ5Xw)
- **Example Transaction Hash**: [`afe5e19b3cdbd9b871309bb8477daac0866aab82c7e6078fedd28d1431e15a43`](https://stellar.expert/explorer/testnet/tx/afe5e19b3cdbd9b871309bb8477daac0866aab82c7e6078fedd28d1431e15a43)
- **SecurePay: EscrowX Contract ID**: `CDT2FAK6BACGLMLXOBPKYGMLOU4KD24Q2BBVYRLHPLTYDN56MCASW32C`
- **Native XLM SAC**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`

## 🌟 Key Features

1. **On-Chain Escrows**: Lock, fund, request release, approve, or refund transactions entirely on-chain. Smart contracts ensure strict rules without middlemen.
2. **Freighter Wallet Integration**: Connect and authenticate securely using the Freighter browser extension on Stellar Testnet. 
3. **Low-Cost & Fast**: Built on Stellar, meaning escrows are settled in seconds for fractions of a cent.
4. **Glassmorphic Responsive UI**: Premium, mobile-responsive styling configured with Tailwind CSS v4 and a new Neon Cyan & Emerald design system.
5. **Analytics & Tracking**: Sentry error tracking and PostHog custom event capture. Supabase integration for seamless caching of escrow metadata.

---

## 📝 Requirements Met

- **Advanced smart contract development**: Built with Rust (Soroban), encompassing multi-state escrow lifecycles (Created, Funded, Release Requested, Completed, Refunded).
- **Event streaming & real-time updates**: Supabase syncing and robust state tracking.
- **CI/CD pipeline setup**: GitHub Actions automatically run contract tests and frontend builds.
- **Smart contract deployment workflow**: Scripts provided for deploying the escrow contract to the Stellar Testnet.
- **Mobile responsive frontend development**: Fully responsive dashboards, escrow creation forms, and transaction details across devices.
- **Error handling & loading states**: Sentry integration and loading indicators for all blockchain interactions.
- **Writing tests for contracts and frontend**: Extensive Rust unit tests covering deposit, release, and refund logic.
- **Production-ready architecture practices**: Decoupled smart contracts, Vite React frontend, and robust fallback caching.
- **Documentation & demo presentation**: Thorough README, architecture notes, and demo video.

---

## 📸 Screenshots & Evidence

| Dashboard & Overview | Contract Lifecycle & Tracking |
|:---:|:---:|
| <img src="screenshots/dashboard.png" width="400" alt="Dashboard"> | <img src="screenshots/progres_tarcker.png" width="400" alt="Progress Tracker"> |

| Mobile Responsive View | Client Deposit & Lock |
|:---:|:---:|
| <img src="screenshots/responsive_mobile_tab.png" width="400" alt="Mobile Design"> | <img src="screenshots/client_deposit_lock.png" width="400" alt="Client Deposit"> |

---

## 👥 Transaction Proofs (10+ On-Chain Interactions)

We successfully executed and verified over 10 end-to-end escrows on the Stellar Testnet.

| # | Action / Method | Wallet Address | Amount | Transaction Hash (StellarExpert Link) |
|---|---|---|---|---|
| 1 | `create_escrow` | Client: *Your Wallet* | *Active* | [View Latest Tx Link](https://stellar.expert/explorer/testnet/tx/18381721292574720#18381721292574721) |
| 2 | `create_escrow` | Client: `GBIV3G3SWA6IOE5YMURC63ZPSK7XFVX6OE6NEZRF4JTTTOMQPOFYFQ2H` <br> Freelancer: `GDE35VBF4A7MAIG2EYSB24IOX6LXA4QJPNNI7URZBL2KLGB4RJS4FHS2` | 500 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/af83259207e475a3b22dfbc30b4ab1fa822fdfa43a4068c2adac26b70df63278) |
| 3 | `create_escrow` | Client: `GD4G6QVTA4XPZ2TV2QKBII7BDLIIVRBQ7DKTTFGLRPBVMPPML65W3TDQ` <br> Freelancer: `GDKXQHAYJJMLGVYV6BCT7CYY4PNGFC4QEH7MN7L73SE2I57UY4CUBMSZ` | 500 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/83119829b0edd4a6353b357b406dfb1e9e16cf4d954855230a596399622d3150) |
| 4 | `create_escrow` | Client: `GB6BFCHQWQNSMLK5AX5WKOYV5MOY6DNVU4CNYDQ32K2I2GKSYVUXOX43` <br> Freelancer: `GDZZGDKBCPO67Y5HTJUKAJEFJVG33ELM2ZCSERO4WLHYBOTWWERGHR6G` | 500 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/71c4ac6aa40c885703df1f51587dce18f459d745914f916e75064bf4f6de1019) |
| 5 | `create_escrow` | Client: `GD56L6HJ67PFSFSG3DSTM7WILS56SBGNR7DEW2CCQTMM76HAJGTFPU6Q` <br> Freelancer: `GD6RTQZNVIQ2Q3RBJJH56VHPNCYPNDSYNIUIBUTQYH3N6KNFXG2T3OBN` | 873 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/91864d6f39f71f6355ebed19b5212afcfd574b38d86b4fff5e74d5c3beb4eb0a) |
| 6 | `create_escrow` | Client: `GCGHUFFQKELOHLDBKFTIB4NOCHOX3LCFRWFWK4DGDP7WIVAIH25QFI5J` <br> Freelancer: `GCZU5D6S62WM5537UACLB7WZJY347DXDE5UGD7TJBPVGFWI54GLONDJX` | 854 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/a7caf8234db99355e66bd8ac4d04725206f3fe62e262d8ebdf5dd04cd6cf88fd) |
| 7 | `create_escrow` | Client: `GBYRXJ4AWPUEL467BKKFTOYY7GTA6FPW7NPZ547T4HXZWNOOU7RXWV3Q` <br> Freelancer: `GD4JGRFUUMF4CCZGVQBM3R45RHTS6KXA6QU4U7ADFWWMFWCSABCIEG3G` | 945 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/155e5edb38306a65783921c669fc9b9ab175b5d894f809fb5d8ff9fa21267a01) |
| 8 | `create_escrow` | Client: `GDP57ZI4CTMJEVJLXWD3NGET2ARYV4UVH6AW7IQNGK7AVMMP7662VGDK` <br> Freelancer: `GDMRZZPV2ETPULVH2QNBR3DXPAZAABQY5DCSQV42BEYVBSYYGSXQIX62` | 335 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/4656c62f5fda32d3a238498db8c68ab9777fef96e6b4aacdaa2318c9497e6c05) |
| 9 | `create_escrow` | Client: `GDTKSOCRV2JLZXV5VZ4WM364CTJUEOXKCGIZE6QXSCPOR36PKE2PBBQB` <br> Freelancer: `GDU5D5QQVNLNDBXBH4MPQ62QQJR6EFD5ISSMB62C6X2K6NTYXLTIZUNN` | 413 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/091cdb1ffa06fa0f69b23f857c54cdade502ca47c9a1e0a4cdf0b4e83c6c956d) |
| 10 | `create_escrow` | Client: `GA7RBNUGZVXKFYXRHAFR7RQWZOXCWZNHDI42T4GB4WYY3KFV5S7SGGWI` <br> Freelancer: `GAVD5S2FLYWAKEI6RB3BOE7VJ7J5QVNYMJK3IQ554Q2OLEK3UYMFNUX2` | 282 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/158c7bb4ea9e7c10a168be8d321e1ccb841671b99e9f713d07c241398979cfcd) |
| 11 | `create_escrow` | Client: `GDTNGKJ6XVG5B4KGLDRBMUCY2UNMCXW22MWSEDP4ZJ7FA3Q5Q4GPEZSK` <br> Freelancer: `GBYYOOWTDKPKQZSGBNJSVBENMDR6WSABD5SAAIBUS2FU7P3NQBJRVJQU` | 681 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/19695f1120bb5d3561e8a5c9c2c6bcf144a466716fd890bb560176774ad48783) |
| 12 | `create_escrow` | Client: `GBZYTQ43DMK3YO3X5HQISPAMECAP3IQFLSTIOOOHCCEJYFFXGUCGDTTJ` <br> Freelancer: `GDDASSMA6OFZVXK56JJLHVT5ZZ7W2XYWHBNGOQXUSAW2AQLXL3QZ3GKC` | 393 XLM | [View Tx Link](https://stellar.expert/explorer/testnet/tx/3954c9b824a54b3b589ca1fd26548768638355590919b5fc1157f16e29d0407b) |

---

## 🛠 Setup & Running Locally

### Prerequisites
- Node.js (v18+)
- Rust & Cargo (Rust 1.84+ with `wasm32v1-none` target configured)

### 1. Smart Contract Setup & Tests
```bash
cd contract
cargo test
cargo build --target wasm32v1-none --release
```

### 2. Frontend Setup & Run
```bash
cd frontend
npm install
npm run dev
```
