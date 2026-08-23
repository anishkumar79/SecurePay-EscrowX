# 🚀 SecurePay: EscrowX — Secure Freelance Payments on Stellar

SecurePay: EscrowX is a decentralized, transparent, and low-cost freelance payment protection escrow application built on the Stellar network using Soroban smart contracts. It empowers independent contractors and clients to transact safely without high fees or payment delay risks.

## 🔗 Live Demo & Links
- **Live Platform**: [https://secure-pay-escrow-x.vercel.app/](https://secure-pay-escrow-x.vercel.app/)
- **Pitch Deck / PPT**: [View Level 5 Pitch Deck](https://docs.google.com/presentation/d/1VHTVturomk5Q9evszTtNGGXrHhU2tcLn/edit?slide=id.p1#slide=id.p1)
- **Demo Video**: [Watch the SecurePay: EscrowX Walkthrough](https://youtu.be/mR9KDsVQ5Xw)
- **Example Transaction Hash**: [`d5e723dd96d87344e4a65aaf44ba76e9bb6f41e1767f982752324cd14a5f6fc9`](https://stellar.expert/explorer/testnet/tx/d5e723dd96d87344e4a65aaf44ba76e9bb6f41e1767f982752324cd14a5f6fc9)
- **User Onboarding Data (50+ Users)**: [View Exported Excel/CSV Sheet Here](https://docs.google.com/spreadsheets/d/1dLYMfc6uc66GsNsEJng8AL_uDd52oJ0cCNuW3YjyQRI/edit?usp=sharing)
- **Google Form Link**: [Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLScTrZj4SRqyOhWgha73qzTQUoSjKeupRB9NJ_V3IPkN-Wwvbg/viewform?usp=publish-editor)

## 📜 Smart Contract Details
- **SecurePay: EscrowX Contract ID**: `CDT2FAK6BACGLMLXOBPKYGMLOU4KD24Q2BBVYRLHPLTYDN56MCASW32C`
- **Native XLM SAC**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
- **Network**: Stellar Testnet
- **Explorer**: [View on StellarExpert](https://stellar.expert/explorer/testnet/contract/CDT2FAK6BACGLMLXOBPKYGMLOU4KD24Q2BBVYRLHPLTYDN56MCASW32C)

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

| Landing Page | Mobile Responsive View |
|:---:|:---:|
| <img src="screenshots/landing_page.png" width="400" alt="Landing Page"> | <img src="screenshots/mobile_responsive_ui.png" width="400" alt="Mobile Design"> |

| Analytics & Tracking |
|:---:|
| <img src="screenshots/analytics.png" width="800" alt="Analytics"> |

---

## 👥 Transaction Proofs & User Feedback

We successfully executed and verified 12 end-to-end escrows on the Stellar Testnet and collected feedback from our users.

[📊 View Raw User Feedback Data (Google Sheet)](https://docs.google.com/spreadsheets/d/1dLYMfc6uc66GsNsEJng8AL_uDd52oJ0cCNuW3YjyQRI/edit?usp=sharing)

### 1. User Onboarded Table
| # | Name | Email | Wallet Address | Feedback |
|---|---|---|---|---|
| 1 | Shant Anav | `shantanav7@gmail.com` | `GBCJEMERVSFFXKH3EMXELYFJOQ6NRDAW3F5LY3ZXIV46T4IOQO7YQLYV` | The new neon cyan and emerald theme is stunning! Very modern. However, I'd love a toggle to switch back to a lighter theme for daytime use if possible |
| 2 | Anu Mehta | `anukr12354@gmail.com` | `GBIV3G3SWA6IOE5YMURC63ZPSK7XFVX6OE6NEZRF4JTTTOMQPOFYFQ2H` | Connecting Freighter was seamless, and the transaction fees are practically zero. As a freelancer, I really appreciate not losing 20% to platform fees. Would be great to have email notifications when a client deposits funds |
| 3 | Ennamulle Enzo | `enzobaby0099@gmail.com` | `GD4G6QVTA4XPZ2TV2QKBII7BDLIIVRBQ7DKTTFGLRPBVMPPML65W3TDQ` | really solid concept. The on-chain tracking is very transparent. One improvement: please add an option to add attachments or a link to the deliverables directly within the escrow agreement before requesting release |
| 4 | Soham R Patil | `sohamrpatil4220@gmail.com` | `GB6BFCHQWQNSMLK5AX5WKOYV5MOY6DNVU4CNYDQ32K2I2GKSYVUXOX43` | The escrow creation process is fast, but it would be helpful if the UI showed the equivalent USD value of the XLM being locked up, just for easier reference for non-crypto native clients |
| 5 | Jayant Vaibhav | `jayantvaibhavspj@gmail.com` | `GD56L6HJ67PFSFSG3DSTM7WILS56SBGNR7DEW2CCQTMM76HAJGTFPU6Q` | great dApp, very fast settlement on Stellar. One issue I noticed: if I accidentally type the wrong wallet address for the freelancer, there's no way to cancel the contract before depositing. A 'Cancel Draft' button would be nice |
| 6 | Ranjan Mehta | `mehtaranjana745@gmail.com` | `GCGHUFFQKELOHLDBKFTIB4NOCHOX3LCFRWFWK4DGDP7WIVAIH25QFI5J` | The progress tracker timeline is a great visual. It makes it very clear what stage the escrow is in. I'd love to see a 'Milestone' feature added in the future, where a single escrow can be released in chunks rather than all at once |
| 7 | Himanshu Jha | `jhahimanshu653@gmail.com` | `GBYRXJ4AWPUEL467BKKFTOYY7GTA6FPW7NPZ547T4HXZWNOOU7RXWV3Q` | Super low fees and transparent. I did have a bit of trouble understanding the 'refund' logic at first. A small tooltip or '?' icon explaining that clients can only refund after the release time expires would be very helpful |
| 8 | Akash Mondal | `73akash58mondal@gmail.com` | `GDP57ZI4CTMJEVJLXWD3NGET2ARYV4UVH6AW7IQNGK7AVMMP7662VGDK` | Love the glassmorphic UI, feels very premium! My feedback: it would be awesome to support USDC on Stellar in addition to native XLM, since clients usually prefer paying in stablecoins |
| 9 | rohit sharma | `rohitsharma82@gmail.com` | `GDTKSOCRV2JLZXV5VZ4WM364CTJUEOXKCGIZE6QXSCPOR36PKE2PBBQB` | works perfectly on my desktop, but on my mobile device, the dashboard table gets a little squished. Making the active contracts list horizontally scrollable on mobile would improve the experience |
| 10 | Priya D | `priyad1999@gmail.com` | `GA7RBNUGZVXKFYXRHAFR7RQWZOXCWZNHDI42T4GB4WYY3KFV5S7SGGWI` | The transparency of having everything on the ledger is fantastic. It would be helpful if the platform could generate a simple PDF invoice or receipt after an escrow is successfully released for tax purposes |
| 11 | Vikram Singh | `vikramsinghdev@gmail.com` | `GDTNGKJ6XVG5B4KGLDRBMUCY2UNMCXW22MWSEDP4ZJ7FA3Q5Q4GPEZSK` | Really impressed by the speed of the Soroban smart contracts. No waiting around for block confirmations. A nice-to-have would be a public profile or simple rating system so freelancers can build reputation based on completed escrows |
| 12 | Khushi Singh | `khushisingh44889@gmail.com` | `GBZYTQ43DMK3YO3X5HQISPAMECAP3IQFLSTIOOOHCCEJYFFXGUCGDTTJ` | application is incredibly cheap to use. I love the concept. Please add a 'Dispute' button just in case the freelancer disappears or doesn't deliver the work as promised before the release time hits |

### 2. Feedback Implementation & Evolution
Based on the extensive feedback collected from our users, we have actively evolved the platform. Users requested UI improvements, tooltip clarifications, mobile responsiveness, and fiat currency options.

We implemented these real feature requests directly into the production platform with unique Git commits:


| User Name | User Feedback | Improvement Made | Github Commit |
|---|---|---|---|
| Ennamulle Enzo | "please add an option to add attachments or a link to the deliverables directly within the escrow agreement before requesting release" | Added a 'Deliverables URL' input field for freelancers when requesting release. | [`2ca1868`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/2ca1868) |
| Jayant Vaibhav | "A 'Cancel Draft' button would be nice" | Added a 'Clear Form' button to the Escrow Creation page to quickly reset inputs. | [`af92bf0`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/af92bf0) |
| Akash Mondal | "it would be awesome to support USDC on Stellar in addition to native XLM" | Added a Contract Token selection dropdown showing XLM and upcoming USDC support. | [`af92bf0`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/af92bf0) |
| Priya D | "It would be helpful if the platform could generate a simple PDF invoice or receipt" | Added a 'Download PDF Receipt' action button for completed escrows. | [`ef95a42`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/ef95a42) |
| Khushi Singh | "Please add a 'Dispute' button just in case the freelancer disappears" | Added a 'File Dispute' resolution button for active escrows. | [`ef95a42`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/ef95a42) |
| rakesh Sharma | "It would be great if clients could tip the freelancer directly from the escrow page" | Added a 'Tip Freelancer' action for clients on successfully released escrows. | [`ef95a42`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/ef95a42) |
| Sunita Gupta | "push notification feature would be awesome" | Integrated a Push Notification Bell icon in the global navigation bar. | [`ea2db86`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/ea2db86) |
| Vikram Singh | "A nice-to-have would be a public profile or simple rating system so freelancers can build reputation" | Displayed a 'Top Rated' 5-star reputation indicator next to the Freelancer wallet address. | [`386e76e`](https://github.com/anishkumar79/SecurePay-EscrowX/commit/386e76e) |


### 3. Proof Transaction Table
| # | User Full Name | Stellar Wallet Address | Transaction Proof (Testnet) |
|---|---|---|---|
| 1 | **Shant Anav** | `GBCJEMERVSFFXKH3EMXELYFJOQ6NRDAW3F5LY3ZXIV46T4IOQO7YQLYV` | [View Tx 1838172129...](https://stellar.expert/explorer/testnet/tx/18381721292574720#18381721292574721) |
| 2 | **Anu Mehta** | `GBIV3G3SWA6IOE5YMURC63ZPSK7XFVX6OE6NEZRF4JTTTOMQPOFYFQ2H` | [View Tx af83259207...](https://stellar.expert/explorer/testnet/tx/af83259207e475a3b22dfbc30b4ab1fa822fdfa43a4068c2adac26b70df63278) |
| 3 | **Ennamulle Enzo** | `GD4G6QVTA4XPZ2TV2QKBII7BDLIIVRBQ7DKTTFGLRPBVMPPML65W3TDQ` | [View Tx 83119829b0...](https://stellar.expert/explorer/testnet/tx/83119829b0edd4a6353b357b406dfb1e9e16cf4d954855230a596399622d3150) |
| 4 | **Soham R Patil** | `GB6BFCHQWQNSMLK5AX5WKOYV5MOY6DNVU4CNYDQ32K2I2GKSYVUXOX43` | [View Tx 71c4ac6aa4...](https://stellar.expert/explorer/testnet/tx/71c4ac6aa40c885703df1f51587dce18f459d745914f916e75064bf4f6de1019) |
| 5 | **Jayant Vaibhav** | `GD56L6HJ67PFSFSG3DSTM7WILS56SBGNR7DEW2CCQTMM76HAJGTFPU6Q` | [View Tx 91864d6f39...](https://stellar.expert/explorer/testnet/tx/91864d6f39f71f6355ebed19b5212afcfd574b38d86b4fff5e74d5c3beb4eb0a) |
| 6 | **Ranjan Mehta** | `GCGHUFFQKELOHLDBKFTIB4NOCHOX3LCFRWFWK4DGDP7WIVAIH25QFI5J` | [View Tx a7caf8234d...](https://stellar.expert/explorer/testnet/tx/a7caf8234db99355e66bd8ac4d04725206f3fe62e262d8ebdf5dd04cd6cf88fd) |
| 7 | **Himanshu Jha** | `GBYRXJ4AWPUEL467BKKFTOYY7GTA6FPW7NPZ547T4HXZWNOOU7RXWV3Q` | [View Tx 155e5edb38...](https://stellar.expert/explorer/testnet/tx/155e5edb38306a65783921c669fc9b9ab175b5d894f809fb5d8ff9fa21267a01) |
| 8 | **Akash Mondal** | `GDP57ZI4CTMJEVJLXWD3NGET2ARYV4UVH6AW7IQNGK7AVMMP7662VGDK` | [View Tx 4656c62f5f...](https://stellar.expert/explorer/testnet/tx/4656c62f5fda32d3a238498db8c68ab9777fef96e6b4aacdaa2318c9497e6c05) |
| 9 | **rohit sharma** | `GDTKSOCRV2JLZXV5VZ4WM364CTJUEOXKCGIZE6QXSCPOR36PKE2PBBQB` | [View Tx 091cdb1ffa...](https://stellar.expert/explorer/testnet/tx/091cdb1ffa06fa0f69b23f857c54cdade502ca47c9a1e0a4cdf0b4e83c6c956d) |
| 10 | **Priya D** | `GA7RBNUGZVXKFYXRHAFR7RQWZOXCWZNHDI42T4GB4WYY3KFV5S7SGGWI` | [View Tx 158c7bb4ea...](https://stellar.expert/explorer/testnet/tx/158c7bb4ea9e7c10a168be8d321e1ccb841671b99e9f713d07c241398979cfcd) |
| 11 | **Vikram Singh** | `GDTNGKJ6XVG5B4KGLDRBMUCY2UNMCXW22MWSEDP4ZJ7FA3Q5Q4GPEZSK` | [View Tx 19695f1120...](https://stellar.expert/explorer/testnet/tx/19695f1120bb5d3561e8a5c9c2c6bcf144a466716fd890bb560176774ad48783) |
| 12 | **Khushi Singh** | `GBZYTQ43DMK3YO3X5HQISPAMECAP3IQFLSTIOOOHCCEJYFFXGUCGDTTJ` | [View Tx 3954c9b824...](https://stellar.expert/explorer/testnet/tx/3954c9b824a54b3b589ca1fd26548768638355590919b5fc1157f16e29d0407b) |
| 13 | **Smriti kumari** | `GDMUURFMPNJOTK5FKZRD6VZGZ7BRJAZBGKL2OOLSBGGUIAC5A22FGMQ5` | [View Tx 0735cbd802...](https://stellar.expert/explorer/testnet/tx/0735cbd802b950d577f3e5e48e03e53a1cb1ea9c89182ead547df721535f8b00) |
| 14 | **Sara Anaya** | `GDIWFVM4X6HXHXDGRN6CRY6KNQATQCNKX7TNZ56DRRFTV7MBL7UYUTHY` | [View Tx 36602af8b5...](https://stellar.expert/explorer/testnet/tx/36602af8b5aad71529123c8518f0f0eba246e66a334d70c72f213d971f7037b0) |
| 15 | **Subheksh koma** | `GACI3NCQ4TF2YCKXXPLIJDECRKOOW67TMPDBOVGZSJPD4Q2YWA3MBLLT` | [View Tx d0348a1130...](https://stellar.expert/explorer/testnet/tx/d0348a11306f281c0ab94e47705725cf2373e437974063265f1e5541bdf6b678) |
| 16 | **Simmi Tiwari** | `GBU3CMVQLVCLITH3IWBUVZFQ55HK3XAL6Z42FWXXCJDZRUOZQOQJVUDW` | [View Tx 74249dad6f...](https://stellar.expert/explorer/testnet/tx/74249dad6f18146fadaa246868d9873124f4949bad06743e569235966c181933) |
| 17 | **Anil Kumar** | `GANDVV2LII4WWA4BWBDTYDMRC6RN5FAJLBWTMKE47NAG4P6X4DYHVJZ6` | [View Tx 73632cd30c...](https://stellar.expert/explorer/testnet/tx/73632cd30cbd899279d28e82720854f16dd8ff99eaa4e77be6f50d4c38fff03f) |
| 18 | **Sunita Gupta** | `GAQP46RWGPPDNRVH4KMSLFGO5D4TE2YFL372S642CRIQYMHCLCT56CCM` | [View Tx b49a3634c2...](https://stellar.expert/explorer/testnet/tx/b49a3634c2164cedd496bf979a9e5fd531282ea79c6ef0145eb065ae16ec9644) |
| 19 | **rakesh Sharma** | `GA3LIURWDR2Q6XYWACY33I5I6R7ICOOBWLQQXVWLMTGL65SYOMM6KQWN` | [View Tx 0233ff6f38...](https://stellar.expert/explorer/testnet/tx/0233ff6f3803a7c0d469878b2c33fa5c591e51a526358440a5f22d6bcce60d29) |
| 20 | **Kavita Singh** | `GAKWK3GMDJJBJMGVEWL4XVUQQ4IWYPY2FRO4FNZ3W3SL4OZMMPNLNPQW` | [View Tx a5416d60af...](https://stellar.expert/explorer/testnet/tx/a5416d60aff1d98159fa214f931c6920b195f458b92945295c8c5e773f40550f) |
| 21 | **Deepak** | `GAHGB4PKMOHF3OQPO7OEYQ4JKM4PMCL3C6UUUC7QT756BIZE7SVNYSKO` | [View Tx 4d001daae5...](https://stellar.expert/explorer/testnet/tx/4d001daae50cbfed48d1fed9e23f4e3fa83a700c2c27f515fa071e4fd70618ae) |
| 22 | **Pooja Chauhan** | `GDJILWLZ32HI6GYP2RYZVQAPYH5TDJKH7ENW3ZKXOEZIJGBPYD7Z72SQ` | [View Tx 99d09b369c...](https://stellar.expert/explorer/testnet/tx/99d09b369c0849331fb6f1dad203db9a78ea5304f971b291921e680eee4dc591) |
| 23 | **Sanjay rao** | `GA44GA5TAT6KLRXK5DJVTLGDS6D55735TLYLOHQKJOFLLCHIIENZXWCO` | [View Tx 8a520a8ee6...](https://stellar.expert/explorer/testnet/tx/8a520a8ee60835ec8d495125a5a5e64cad288b76730331d17687055a316b6e9c) |
| 24 | **Anjali Sharma** | `GBFUXYWP3NHYBLA6QWBPR4YZIU26USENSO6QMSWHMSV5FNSXIVJX2246` | [View Tx e4d3dbe296...](https://stellar.expert/explorer/testnet/tx/e4d3dbe296072777ffcd36626544b2a03c0b92c08730c7d537cecfa7aecf0cde) |
| 25 | **Suresh Patel** | `GAWZ64KFSPI2J72LMFKVA2LHOK4PHPFIODMWCBDKYQIWRBTLPCC4DY67` | [View Tx 066a0897ed...](https://stellar.expert/explorer/testnet/tx/066a0897ed3369af8139556fadc890dfefb78d6cfc2e28b947316876268f5b72) |
| 26 | **Seema Shah** | `GDDFQ2OT7BNKNT57UPA6MRXLZMSBAWEOWBGKD6ODFREL6JLLGCHXHVFE` | [View Tx 30b110f908...](https://stellar.expert/explorer/testnet/tx/30b110f9085bb02bb4071177954eaf90347e467a9d34b0b1628be4d0f06dcba0) |
| 27 | **Arti Desai** | `GCV23NPBBUFWTPT5KVE3EDQ43JJHSOWKDYYCUYBF2TAJFWW25BAVVKP7` | [View Tx 64176a2e98...](https://stellar.expert/explorer/testnet/tx/64176a2e98e070d052044d241055750744f295136d3ae3e9876171f37a441457) |
| 28 | **Prakash** | `GCDGH7Q6U2HU6IOLKJAPJQWLVZL756QIPN3EAPQAVSCM5D46SKU34ZJU` | [View Tx d6e6ee317b...](https://stellar.expert/explorer/testnet/tx/d6e6ee317b30c15928df6cec9a1a625e661d48590d26f2aacc6e237a964d6f97) |
| 29 | **Rahul Kumar** | `GBCO4Z4HZ2FEUXIKLL7KUJMDZEB7GAD77WBOG26XTNNUPBIVP6BJHDNW` | [View Tx 8144397c8c...](https://stellar.expert/explorer/testnet/tx/8144397c8c6064ff1c271c1154002bd859db9d2372c595f2313a471979eecc7b) |
| 30 | **Anish Kumar** | `GAYNIL6XXQJDESUAUJZY6UGIZBXCNVPKROSV4RA5JYBLYGUY4IYVPTYC` | [View Tx e3f41f33cd...](https://stellar.expert/explorer/testnet/tx/e3f41f33cd8f4583d1d6795f7b29cc12712e4e44a67894abb539fac12660ecf6) |
| 31 | **Amit Jain** | `GANPT5YHXQZPS4EY4QHK3KBECWDLVFTW5RPVJGY5IEWWMTR6XTD4QF5C` | [View Tx 6e5700f400...](https://stellar.expert/explorer/testnet/tx/6e5700f400c00d248661b1343a9065b980a8cde15384585500e303a284dc176d) |
| 32 | **divya kumari** | `GC5SM267X3RRYCYA2VIZIG6DWOVZ7RE4LSRYYRW3D6KX67AMVHIEV6UD` | [View Tx c6c2f684f6...](https://stellar.expert/explorer/testnet/tx/c6c2f684f6bb0c4f4c919bbb197cd5ee24d5eb59c5baabdb51b699b93753d96b) |
| 33 | **Ravi Banerjee** | `GD23FC6SVXIAEE5MTPQ3V2MT75ZAKAIPYJLBVNWUVDE6AV5RXLNHIUMD` | [View Tx 6eb2018ca2...](https://stellar.expert/explorer/testnet/tx/6eb2018ca2b1666d4d8bdd30f6c62453e1ecf4ac17f213323436d17d9573e032) |
| 34 | **Neha Mishra** | `GBRV75Z3WLWGRCFD6PU6QGQMUILXTGPA45AVSJXNYM5SF3GXUWALYU6U` | [View Tx dc4bfaadef...](https://stellar.expert/explorer/testnet/tx/dc4bfaadef942b4a6874e84521700bd27f92f2cf7325fff642e48b57c9fba020) |
| 35 | **Ajay Thakur** | `GD7DJ3F2USIXVO2T26TED4SLTDQLWDQNBEIZMYEIRRFA7G75S7HKHQ6D` | [View Tx 9079edac73...](https://stellar.expert/explorer/testnet/tx/9079edac73385599e25379572d9d4f71fec828882e0f067a2c854cd05730763f) |
| 36 | **Ritu Prasad** | `GDJILGLVICSQIJ2BLGGZNNRRCEJXYVUW6G4OJI3TB5Z3XTA4O2CMUZOC` | [View Tx d5e723dd96...](https://stellar.expert/explorer/testnet/tx/d5e723dd96d87344e4a65aaf44ba76e9bb6f41e1767f982752324cd14a5f6fc9) |
| 37 | **Vandana kapoor** | `GBZNGMPNONVIRMHJIFSJYPBVM6WQHJXXIWY5PP74IE6CLCRKIC7ZGISB` | [View Tx 902fb0ab67...](https://stellar.expert/explorer/testnet/tx/902fb0ab67d244d318a110613a69e6aea9f4633f9e3d8e18a6a7196bc985e97b) |
| 38 | **Jyoti Gupta** | `GAWPGF67SB2R7DRL57XCC2ISJFQAAYRGKHBYQ7HFMZ7ZTNWN3VYOOJNY` | [View Tx 9543403ba9...](https://stellar.expert/explorer/testnet/tx/9543403ba990e9822f9669bc0a49533aee48217166b0b840950c3930cc817cb9) |
| 39 | **Naveen Pathak** | `GAF2WJGEHTT5STM7FPO4DQBABUHFQTZDTGRNT7KCUWTCOBJ6YGDYAZXF` | [View Tx 21bfdaf760...](https://stellar.expert/explorer/testnet/tx/21bfdaf76013caf8adb8a1d82394d1637bda5db25207d06253b9c1eff6d45da3) |
| 40 | **Swati Gupta** | `GDU5UN7CTPKACU4IXRZSXMVN223AZM7DRRVZWE3RI3IYXCCOX4FZVBN6` | [View Tx 0edfafe73e...](https://stellar.expert/explorer/testnet/tx/0edfafe73e8e84d78a787eb1f620fa10dfa3bb846c391f7ee6c5464513576719) |
| 41 | **Preeti Kumari** | `GDLSKHCVL44DH5NTTZJBPN2HWVCMRW6KX5AMPZO5DDMNQFU6HLPRW7QC` | [View Tx e9cd37a4bf...](https://stellar.expert/explorer/testnet/tx/e9cd37a4bf91d559991698aa35e4d0128ae95b7e6d55751717eebb0e5e9f233e) |
| 42 | **Manish Kumar** | `GCHTB6O26RXMSYXTTKYFG4GQ7GBAXE54PZWA6YUZTMR4UKWAWXFEXNID` | [View Tx 153484f927...](https://stellar.expert/explorer/testnet/tx/153484f9276a81154f0cc83ba00dd975be09720c9b32d7464ee540b842e26ef0) |
| 43 | **Vikram Sharma** | `GCMALRHIQ3Z4P6KPO3TKJXD3HCVGRXSVDIXZVOBJR6PO6DO6U2WHG54M` | [View Tx 86999e0b02...](https://stellar.expert/explorer/testnet/tx/86999e0b02275cbef2ca9cf99d4cf4bc8092f83ef531f8f849aded6b68ed65f8) |
| 44 | **Aditi Singh** | `GD5QIYINXOZTLOKI4Z256O4RDCASYNZJJE4HE7EUTCCM6UAM2R7MFWA5` | [View Tx 199c546395...](https://stellar.expert/explorer/testnet/tx/199c54639565af880c5a110a995fe70118629a291dddfac93e569e9422f04a51) |
| 45 | **Rohan Patel** | `GAGHDQY3EEGVLFJ2WBH6IRHU5IRIP5BKPJESORU4BA73VC2UNAPUYAFU` | [View Tx 688f5a92f5...](https://stellar.expert/explorer/testnet/tx/688f5a92f56a1d3765e4c7119bee9f228d668716a67ba7b48438c8a69245eab9) |
| 46 | **Sneha Reddy** | `GB4ID2MC2O3HEQR2DGP7NEOYZEPQZSR4MAIUXKJCLWCNLTEEYAANA2IN` | [View Tx 887ddeacd3...](https://stellar.expert/explorer/testnet/tx/887ddeacd328239ed31c06af60f151175279cda76f3817fa17b588495a55b2d2) |
| 47 | **Kunal Verma** | `GC3R5TO6PLVBCCPSPDA3YEBW6RCNOZ3IBCJKUOZSGX3SR3UMUMPC6LN7` | [View Tx 466d00176f...](https://stellar.expert/explorer/testnet/tx/466d00176f1e856d248015a0bbbc048b75610e2f117fafaf18ecaa847e25854c) |
| 48 | **Priyanka Desai** | `GBIHPTPN352BFURHORR3FWBMCAQ3BCSDFST72MYNX7EIMWY6FH2XY4BE` | [View Tx 607764c286...](https://stellar.expert/explorer/testnet/tx/607764c286ed23ce2b1723a4bee3866088542b4c61eb7dd4d377c36f045f95c5) |
| 49 | **Sunita Reddy** | `GCLR2NVSYUSQOAJHV5V6W2WKWQE6QBXX7BOWVEDMD6TOD52JBBZX26LX` | [View Tx ea39ad5405...](https://stellar.expert/explorer/testnet/tx/ea39ad5405fb1481be064ec41d31d115d8184c5156752ac969ed0313cf6df1b5) |
| 50 | **Amit Bhardwaj** | `GAIDKB5WQD2FBAPLLYXPBCXBNLV4OY3S7NKNWDDXLQVV6XFSGYIX7EAW` | [View Tx 114cae175f...](https://stellar.expert/explorer/testnet/tx/114cae175f1a9d847b1db5fc14d481565b17ffbb439c000014d5c9f2ca3b4b57) |
| 51 | **Meera Nair** | `GDGDEDWYDL2IZVVBGZJV62OWRMX4GEABNRGCXHNX7O45DSNPNJ27K35K` | [View Tx ee20ca8cf2...](https://stellar.expert/explorer/testnet/tx/ee20ca8cf2b126b0476721935825b9010060f5315294d9440f87ca47ee18478c) |


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
