'use client';

import {
  Box,
  Typography,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormHelperText,
  Divider,
} from '@mui/material';

import {
  CustomerTextArea,
  CustomerTextField,
  CustomerTypography,
  InputWrapper,
  PaymentBox,
  ProductWrapper,
} from './_Step3';
import { useState } from 'react';
import { formatCurrency, isEmptyObject } from '@/utils/string';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldValues } from '@/app/Provider/types';
import useBreakMediaQuery from '@/hooks/useBreakMediaQuery';
import { axiosClientHandler } from '@/utils/axios';
import { CheckoutProps } from '../../types';

const Payment = [
  {
    label: 'Bayar Pakai QR Code',
    description: 'QR BCA, GoPay, OVO, Shopeepay dll',
  },
  {
    label: 'Kartu Kredit',
    description: 'VISA & Mastercard',
  },
  {
    label: 'Transfer Bank (Otomatis)',
    description: 'BCA, Mandiri, Permata, BNI, BRI, dll',
  },
  {
    label: 'Alfamart',
    description: 'Bayar di counter Alfamart terdekat',
  },
];

export default function Step3({ setProgressLoading }: CheckoutProps) {
  const { isMobile } = useBreakMediaQuery();

  const [activePayment, setActivePayment] = useState<number>(0);
  const {
    setValue,
    watch,
    control,
    formState: { errors },
    handleSubmit,
  } = useFormContext<FieldValues>();
  const { countBox, packageSelected, activeStep, file, printSide, totalPrice } = watch();

  const isDisabledButton = () => {
    return !isEmptyObject(errors);
  };

  const submitData = async (data: FieldValues) => {
    setProgressLoading(20);
    const {
      productSelected,
      planSelected,
      packageSelected,
      printSide,
      printCorner,
      countBox,
      totalPrice,
      email,
      fileUrl,
      linkUrl,
      address,
      recipient,
    } = data;

    try {
      setProgressLoading(40);
      const payload = {
        product: productSelected?.tab,
        plan: planSelected?.name,
        package: packageSelected?.name,
        print_side: printSide,
        print_corner: printCorner,
        amount: countBox,
        price: totalPrice,
        file_url: fileUrl,
        link_url: linkUrl,
        sender_email: email,
        recipient_name: recipient.name,
        recipient_email: recipient.email,
        recipient_phone: recipient.phoneNumber,
        address_city: address.city,
        zipcode: address.zipCode,
        address_full: address.fullAddress,
        send_option: address.logisticOption,
        payment_method: '',
        // payment_method: activePayment,
      };
      await axiosClientHandler.post('/api/order/create-order', payload);

      setValue('activeStep', activeStep + 1);
    } catch (error) {
      console.error(error);
    }

    setProgressLoading(100);
  };

  return (
    <div>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={5} mb={8}>
        <Box width={isMobile ? '90%' : '60%'}>
          <ProductWrapper mt={6}>
            <Typography textAlign="center" variant="body1" color="white" fontWeight={600} mt={3} mb={2}>
              Ringkasan Pesanan
            </Typography>
            <Box padding={3} bgcolor={'white'} borderRadius="8px">
              <Box display={isMobile ? 'block' : 'flex'} borderBottom={'2px solid #D4D4D4'} mb={4} pb={2}>
                <Box width={isMobile ? '100%' : '50%'}>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Tipe Kartu Nama</CustomerTypography>
                    <Typography variant="body2">: {packageSelected?.name}</Typography>
                  </InputWrapper>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Sisi Cetak</CustomerTypography>
                    <Typography variant="body2">: {printSide} Sisi</Typography>
                  </InputWrapper>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Laminating</CustomerTypography>
                    <Typography variant="body2">: Tidak</Typography>
                  </InputWrapper>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Finishing</CustomerTypography>
                    <Typography variant="body2">: Tidak</Typography>
                  </InputWrapper>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Jumlah Kotak</CustomerTypography>
                    <Typography variant="body2">: {countBox}</Typography>
                  </InputWrapper>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>File Desain</CustomerTypography>
                    <Typography variant="body2">
                      :{' '}
                      <Typography component="span" variant="body2" color="primary">
                        {file?.name ?? '-'}
                      </Typography>
                    </Typography>
                  </InputWrapper>
                  {isMobile && <Divider sx={{ my: 2 }} />}
                </Box>
                <Box width={isMobile ? '100%' : '50%'}>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Sub Total</CustomerTypography>
                    <Typography variant="body2">: {formatCurrency(packageSelected?.price as string)}</Typography>
                  </InputWrapper>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Biaya Kirim</CustomerTypography>
                    <Typography variant="body2">: {formatCurrency(0)}</Typography>
                  </InputWrapper>
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Diskon</CustomerTypography>
                    <Typography variant="body2">: {formatCurrency(0)}</Typography>
                  </InputWrapper>
                  <InputWrapper sx={{ marginBottom: '10px' }}>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Diskon</CustomerTypography>
                    <CustomerTextField size="small" placeholder="Input Kode Promo" sx={{ width: '160px' }} />
                  </InputWrapper>
                  <Divider sx={{ my: 1, py: 1 }} />
                  <InputWrapper>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Grand Total</CustomerTypography>
                    <Typography variant="h6">{formatCurrency(totalPrice)}</Typography>
                  </InputWrapper>
                </Box>
              </Box>
              <Box borderBottom={'2px solid #D4D4D4'} mb={4} pb={2}>
                <Typography variant="body1" fontWeight="600" mb={2}>
                  Informasi Penerima
                </Typography>
                <InputWrapper>
                  <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Nama</CustomerTypography>
                  <Controller
                    name="recipient.name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomerTextField
                        size="small"
                        {...field}
                        error={!!fieldState.error?.message}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </InputWrapper>
                <InputWrapper>
                  <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Email</CustomerTypography>
                  <Controller
                    name="recipient.email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomerTextField
                        size="small"
                        {...field}
                        error={!!fieldState.error?.message}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </InputWrapper>
                <InputWrapper>
                  <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Nomor Handphone</CustomerTypography>
                  <Controller
                    name="recipient.phoneNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomerTextField
                        size="small"
                        type="number"
                        {...field}
                        error={!!fieldState.error?.message}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </InputWrapper>
              </Box>
              <Box borderBottom={'2px solid #D4D4D4'} mb={4} pb={2}>
                <Typography variant="body1" fontWeight="600" mb={2}>
                  Alamat Pengiriman
                </Typography>
                <InputWrapper>
                  <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Kota / Kecamatan*</CustomerTypography>
                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomerTextField
                        size="small"
                        {...field}
                        error={!!fieldState.error?.message}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </InputWrapper>
                <InputWrapper>
                  <CustomerTypography variant={isMobile ? 'caption' : 'body2'}>Kode Pos*</CustomerTypography>
                  <Controller
                    name="address.zipCode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <CustomerTextField
                        size="small"
                        type="number"
                        {...field}
                        error={!!fieldState.error?.message}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </InputWrapper>
                <InputWrapper sx={{ alignItems: 'start' }}>
                  <Box minWidth={'150px'}>
                    <CustomerTypography variant={isMobile ? 'caption' : 'body2'} sx={isMobile ? { width: '90px' } : {}}>
                      Alamat Lengkap*
                    </CustomerTypography>
                  </Box>
                  <Controller
                    name="address.fullAddress"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={!!fieldState.error?.message} fullWidth>
                        <CustomerTextArea {...field} sx={isMobile ? { width: '100%' } : {}} />
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </InputWrapper>
                <Box display="flex" mb={2}>
                  <CustomerTypography variant={isMobile ? 'caption' : 'body2'} mt="10px">
                    Opsi Pengiriman
                  </CustomerTypography>
                  <Controller
                    name="address.logisticOption"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <FormControlLabel
                          value="regular"
                          control={<Radio size={'small'} />}
                          label={<Typography variant="caption">Regular (2-3 Hari)</Typography>}
                        />
                        <FormControlLabel
                          sx={{ fontSize: '10px' }}
                          value="express"
                          control={<Radio size={'small'} />}
                          label={<Typography variant="caption">Express (1-2 Hari)</Typography>}
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
              </Box>
              <Box mb={4}>
                <Typography variant="body1" fontWeight="600" mb={2}>
                  Pilih Metode Pembayaran (Tanpa Biaya Transaksi)
                </Typography>
                <Box display={isMobile ? 'block' : 'flex'} gap="16px">
                  {Payment.map((item, index) => (
                    <PaymentBox
                      key={index}
                      onClick={() => setActivePayment(index)}
                      sx={isMobile ? { width: '100%', mb: 2 } : {}}>
                      <Radio checked={activePayment === index} size={'small'} />
                      <Typography variant="body2" fontWeight="600">
                        {item.label}
                      </Typography>
                      <Typography variant="caption">{item.description}</Typography>
                    </PaymentBox>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box>
              <Box marginX={3} pb={3}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isDisabledButton()}
                  onClick={() => handleSubmit(submitData)()}>
                  Bayar Sekarang
                </Button>
              </Box>
            </Box>
          </ProductWrapper>
        </Box>
      </Box>
    </div>
  );
}
