import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';
import { stringToHex, numberToHex } from './hexUtils';

export const createCampaign = async (
    name: string,
    hashtag: string,
    quantity: number
) => {

    const transaction = {
        value: 0,
        data: `createCampaign@${stringToHex(name)}@${stringToHex(hashtag)}@${numberToHex(quantity)}`,
        receiver: contractAddress,
        gasLimit: '60000000'
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