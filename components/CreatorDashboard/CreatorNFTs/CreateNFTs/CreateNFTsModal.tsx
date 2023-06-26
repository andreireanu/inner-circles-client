import React, { FC, useState, SetStateAction, useRef, LegacyRef } from 'react';
import {
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Alert,
  Checkbox,
  Box,
  FormGroup,
  FormControlLabel
} from '@mui/material';

import FormProvider from '../../../FormProvider';
import RHFTextField from '../../../RHFTextField';

import { useForm } from 'react-hook-form';
import s from './CreateNFTsModal.module.css';

import { createNonFungibleToken } from '../../../../utils/createNonFungibleToken';

export interface CreateNFTsModalProps {
  className?: string;
  open: boolean;
  handleClose: () => void;
  setCampaigns: SetStateAction<any>;
  campaigns: Array<any>;
}

const CreateNFTsModal: FC<CreateNFTsModalProps> = ({
  handleClose,
  open,
}) => {
  const methods = useForm();
  const [error, setError] = useState<string | null>(null);
  // const [name, setName] = useState('');

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    setError(null);
    createNonFungibleToken(data);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className={s.subContainer}>
          <DialogTitle id='alert-dialog-title'>Create new NFT</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {error ? <Alert severity='error'>{error}</Alert> : null}
              <FormProvider methods={methods}>
                <RHFTextField
                  name='name'
                  label='NFT Name'
                  variant='standard'
                  required
                />
                <RHFTextField
                  name='uri'
                  label='NFT URI'
                  variant='standard'
                  required
                />
                <RHFTextField
                  name='amount'
                  label='Number of NFTs'
                  variant='standard'
                  required
                />
                <RHFTextField
                  name='attributes'
                  label='Attributes'
                  variant='standard'
                  required
                />
                <RHFTextField
                  name='price'
                  label='Price'
                  variant='standard'
                  required
                />
              </FormProvider>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmit(onSubmit)}>Create</Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

export default CreateNFTsModal;
