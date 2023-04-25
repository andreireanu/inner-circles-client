import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Stack } from '@mui/system';
import { useForm } from 'react-hook-form';
import { generateNFT } from '../utils/contractUtils';
import FormProvider from './FormProvider';
import RHFTextField from './RHFTextField';

const CreateExpModal = ({ handleClose }: any) => {
  const methods = useForm();

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    const sessionId = await generateNFT(data.name, data.symbol);

    console.log(sessionId);
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth>
      <DialogTitle>Create your Experience</DialogTitle>

      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <RHFTextField name='name' label='Name' />
            <RHFTextField name='symbol' label='Symbol' />
            <RHFTextField name='description' label='Description' />

            <Button fullWidth size='large' type='submit' variant='contained'>
              Create
            </Button>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExpModal;
