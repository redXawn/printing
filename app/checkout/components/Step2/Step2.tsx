'use client';

import { Box, Typography, FormControl, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

import { ProductWrapper, VisuallyHiddenInput } from './_Step2';
import { UploadIcon } from '@/icons';
import { FieldValues } from '@/app/Provider/types';
import useBreakMediaQuery from '@/hooks/useBreakMediaQuery';
import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { CheckoutProps } from '../../types';

export default function Step2({ setProgressLoading }: CheckoutProps) {
  const { isMobile } = useBreakMediaQuery();

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_KEY as string
  );

  const {
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useFormContext<FieldValues>();
  const { activeStep, file, sendByEmail, email } = watch();
  const [loading, setLoading] = useState<boolean>(false);

  File;
  const handleUpload = async (files: any) => {
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    if (files.length > 0 && files[0].size > maxSize) {
      alert('Ukuran file melebihi 10 MB.');
      return;
    }
    setProgressLoading(20);
    const file = files[0];
    try {
      setLoading(true);
      const fileName = `${file.name}-${Date.now()}`;
      const { data, error } = await supabaseClient.storage.from('design').upload(`File/${fileName}`, file, {
        contentType: file.type,
      });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from('design').getPublicUrl('File');

      const fileUrl = `${publicUrl}/${fileName}`;

      setValue('file', file);
      setValue('fileUrl', fileUrl);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setProgressLoading(100);
  };

  return (
    <div>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={5} mb={8}>
        <Box width={isMobile ? '90%' : '60%'}>
          <ProductWrapper mt={6}>
            <Typography textAlign="center" variant="body1" color="white" fontWeight={600} mt={3} mb={2}>
              Upload Desainmu
            </Typography>
            <Box padding={3} pb={0} bgcolor={'white'} borderRadius="8px">
              <Box position="relative" border="1px dashed #3A86FF" borderRadius="8px" bgcolor="#E8EEF8" py={4} mb={4}>
                {!file ? (
                  <Box margin="auto" display="flex" flexDirection="column" alignItems="center">
                    <UploadIcon />
                    <Box my={2} textAlign="center">
                      <Typography color="#7B92B8" variant="body1" mb={1}>
                        Upload File Desain
                      </Typography>
                      <Typography color="#7B92B8" variant="caption">
                        File yang diterima: png,jpg,pdf. Ukuran max 10mb
                      </Typography>
                    </Box>
                    <Button variant="contained" sx={{ minWidth: '190px' }}>
                      Pilih File
                    </Button>
                  </Box>
                ) : (
                  <Box margin="auto" display="flex" flexDirection="column" alignItems="center">
                    <Box my={2} textAlign="center">
                      <Typography color="#7B92B8" variant="body1" mb={1}>
                        {file.name}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <VisuallyHiddenInput
                  type="file"
                  accept=".png, .jpg, .jpeg, .pdf"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </Box>
              <Box mb={4}>
                <Controller
                  name="linkUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth {...field}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} mb={1}>
                        Atau, copy paste link dari Dropbox, Google Drive, dan lainnya
                      </Typography>
                      <TextField
                        size="small"
                        sx={{
                          '& div': {
                            borderRadius: '8px',
                          },
                        }}
                        placeholder="www.dropbox.com/..."
                        error={!!fieldState?.error?.message}
                        helperText={fieldState?.error?.message}
                      />
                    </FormControl>
                  )}
                />
              </Box>
              <Box mb={4} width={'100%'}>
                <FormControl fullWidth>
                  <Controller
                    name="sendByEmail"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox checked={sendByEmail} size="small" />}
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Atau kirim gambar melalui email
                          </Typography>
                        }
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        variant="standard"
                        disabled={!sendByEmail}
                        placeholder="Email"
                        {...field}
                        error={!!fieldState.error?.message}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </FormControl>
              </Box>
            </Box>
            <Box>
              <Box marginX={3} paddingY={3}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!!(errors.linkUrl || (errors.email && sendByEmail)) || (sendByEmail && !email) || loading}
                  onClick={() => {
                    clearErrors();
                    setValue('activeStep', activeStep + 1);
                    setProgressLoading(100);
                  }}>
                  Selanjutnya
                </Button>
              </Box>
            </Box>
          </ProductWrapper>
        </Box>
      </Box>
    </div>
  );
}
