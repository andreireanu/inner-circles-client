import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';
import { stringToHex, numberToHex } from './hexUtils';

export const createNonFungibleToken = async (
    data: any
) => {
    let name = data.name;
    let uri = data.uri;
    let amount = data.amount;
    let attributes = data.attributes;
    let price = data.price;

    const transaction = {
        value: 0,
        data: `createNft@${stringToHex(name)}@${numberToHex(amount)}@${stringToHex(uri)}@${stringToHex(attributes)}@${numberToHex(price)}`,
        receiver: contractAddress,
        gasLimit: '50000000'
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