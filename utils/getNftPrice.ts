import { useEffect, useState } from 'react';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import {
  ContractFunction,
  ResultsParser,
  Address,
  AddressValue,
  StringValue,
  U32Value
} from '@multiversx/sdk-core/out';
import { smartContract } from './smartContract';

const resultsParser = new ResultsParser();

export const getNftPrice = ({ address, idx }: any) => {
  const { network } = useGetNetworkConfig();
  const [price, setPrice] = useState<string>();
  const proxy = new ProxyNetworkProvider(network.apiAddress);

  const getNftPrice = async () => {
    try {
      const query = smartContract.createQuery({
        func: new ContractFunction('getNftPrice'),
        args: [new AddressValue(new Address(address)),
        new U32Value(idx),],
      });
      const queryResponse = await proxy.queryContract(query);
      const endpointDefinition = smartContract.getEndpoint('getNftPrice');
      const { firstValue } = resultsParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      );
      setPrice(firstValue?.valueOf().c[0]);
    } catch (err) {
      console.error('Unable to call getCreatorToken', err);
    }
  };

  useEffect(() => {
    getNftPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return price;
};
