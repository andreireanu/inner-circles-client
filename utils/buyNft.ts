import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';
import { stringToHex, numberToHex } from './hexUtils';

export const buyNft = async (
    nftToken: string,
    nonce: number,
    token: string,
    price: number,
) => {

    console.log(nftToken);
    console.log(nonce);
    console.log(token);
    console.log(price);

    let inputData = `ESDTTransfer@${stringToHex(token)}@${numberToHex(price)}@6275794e6674@${stringToHex(nftToken)}@${numberToHex(nonce)}`;

    const transaction = {
        value: 0,
        data: inputData,
        receiver: contractAddress,
        gasLimit: '20000000'
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
        transactions: transaction,
        transactionsDisplayInfo: {
            processingMessage: 'Processing Transaction',
            errorMessage: 'An error has occured during transaction',
            successMessage: 'Transaction successful'
        },
        redirectAfterSign: false
    });
    return sessionId;

};