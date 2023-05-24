import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { issueTokens } from '../../../utils/contractUtils';
import FormProvider from '../../FormProvider';
import RHFTextField from '../../RHFTextField';

const SetUpCreator = ({ setCreator }: any) => {
  const [error, setError] = useState<string | null>(null);
  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    setError(null);
    console.log(data.tokenName);
    console.log(data.tokenSymbol);
    // const sessionId = await issueTokens(
    //   data.tokenName,
    //   data.tokenSymbol,
    //   1000000
    // );

    console.log("here")

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
                label='Name'
                variant='standard'
                required
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
              />
              <RHFTextField
                name='tokenSymbol'
                label='Token Symbol'
                variant='standard'
                required
              />
            </Stack>
            <Button
              variant='contained'
              sx={{
                width: '100%',
                marginTop: '1rem',
                padding: '1rem'
              }}
              onClick={handleSubmit(onSubmit)}
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
