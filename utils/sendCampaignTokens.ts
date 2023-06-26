import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';
import { stringToHex, numberToHex } from './hexUtils';
import {
    Address,
} from '@multiversx/sdk-core/out';

interface MultiValue {
    address: string,
    amountTokens: number,
}

export const sendCampaignTokens = async (
    hashtag: string,
    multiValue: Array<MultiValue>,
) => {

    console.log(hashtag)
    console.log(multiValue)

    let inputData = `sendCampaignTokens@${stringToHex(hashtag)}`
    multiValue.forEach((record) => {
        const addressFromBech = Address.fromBech32(record.address).hex();
        let amount = Math.floor(record.amountTokens);
        const tokens = numberToHex(amount);
        console.log(tokens);
        inputData += `@${addressFromBech}@${tokens}`;
    });
    console.log(inputData);

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