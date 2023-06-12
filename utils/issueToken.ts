import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';
import { stringToHex, numberToHex } from './toHex';

export const issueToken = async (
    tokenName: string,
    tokenSymbol: string,
    supply: number
) => {
    console.log('Here');
    console.log(supply.toString());
    console.log(supply.toString(16));

    const transaction = {
        value: 50000000000000000,
        data: `issueFungibleToken@${stringToHex(tokenName)}@${stringToHex(tokenSymbol)}@${numberToHex(supply)
            }`,
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