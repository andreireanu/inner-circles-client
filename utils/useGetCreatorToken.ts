import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import {
  ContractFunction,
  ResultsParser,
  Address,
  AddressValue,
} from '@multiversx/sdk-core/out';
import { smartContract } from './smartContract';

const resultsParser = new ResultsParser();

export const useGetCreatorToken = () => {
  const { network } = useGetNetworkConfig();
  const [creatorToken, setCreatorToken] = useState<string>();

  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getCreatorToken = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('getCreatorToken'),
        args: [new AddressValue(new Address('erd1aqd2v3hsrpgpcscls6a6al35uc3vqjjmskj6vnvl0k93e73x7wpqtpctqw'))]
        // args: [new AddressValue(new Address('erd1wh2rz67zlq5nea7j4lvs39n0yavjlaxal88f744k2ps036ary8dq3ptyd4'))]
      });
      const queryResponse = await proxy.queryContract(query);
      const endpointDefinition = smartContract.getEndpoint('getCreatorToken');
      const { firstValue } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );

      setCreatorToken(firstValue?.valueOf());

      // setPingAmount(amount?.valueOf()?.toString(10));
    } catch (err) {
      console.error('Unable to call getCreatorToken', err);
    }
  };

  useEffect(() => {
    getCreatorToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return creatorToken;
};
