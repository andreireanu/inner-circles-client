import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { issueTokens } from '../../../utils/contractUtils';
import { setCreatorInLocalStorage } from '../../../utils/localStorage';
import FormProvider from '../../FormProvider';
import RHFTextField from '../../RHFTextField';

const SetUpCreator = ({ setCreator }: any) => {
  const [error, setError] = useState<string | null>(null);
  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    setError(null);

    const sessionId = await issueTokens(
      data.tokenName,
      data.tokenSymbol,
      100000
    );

    if (sessionId) {
      // Store un localstorage for mocking
      setCreatorInLocalStorage(data);
      setCreator(data);
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
                label='Name'
                variant='standard'
                required
              />
              <RHFTextField
                name='email'
                label='Email'
                variant='standard'
                type='email'
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
            <Stack
              direction='row'
              justifyContent={'center'}
              spacing={1}
              margin={1}
            >
              <RHFTextField name='twitter' label='Twitter' variant='standard' />
              <RHFTextField
                name='instagram'
                label='Instagram'
                variant='standard'
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
