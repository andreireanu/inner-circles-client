import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { issueToken } from '../../../utils/issueToken';
import FormProvider from '../../FormProvider';
import RHFTextField from '../../RHFTextField';

const SetUpCreator = ({ setCreator }: any) => {
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    setError(null);
    console.log("Clicked")
    // const sessionId = await issueTokens(
    //   data.tokenName,
    //   data.tokenSymbol,
    //   100000
    // );
    const sessionId = null;
    if (sessionId) {
      // Store un localstorage for mocking
    } else {
      // setError(res?.message || 'An error occured please try again');
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 5 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center' }}>
          {error ? (
            <Alert
              severity='error'
              sx={{
                margin: 2
              }}
            >
              {error}
            </Alert>
          ) : null}
          <FormProvider methods={methods}>
            <Stack
              direction='row'
              justifyContent={'center'}
              spacing={1}
              margin={1}
            >
              <RHFTextField
                name='name'
                label='Creator Name'
                variant='standard'
                required
                value={name}
                // onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </Stack>
            <Stack
              direction='row'
              justifyContent={'center'}
              spacing={1}
              margin={1}
            >
              <RHFTextField
                name='tokenName'
                label='Token Name'
                variant='standard'
                required
                // onChange={(e: ChangeEvent<HTMLInputElement>) => setTokenName(e.target.value)}
              />
              <RHFTextField
                name='tokenSymbol'
                label='Token Symbol'
                variant='standard'
                required
                // onChange={(e: ChangeEvent<HTMLInputElement>) => setTokenSymbol(e.target.value)}
              />
            </Stack>
            <Button
              variant='contained'
              sx={{
                width: '100%',
                marginTop: '1rem',
                padding: '1rem'
              }}
              onClick={() => handleSubmit(onSubmit)}
              className='w-full'
            >
              Create Account
            </Button>
          </FormProvider>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SetUpCreator;
