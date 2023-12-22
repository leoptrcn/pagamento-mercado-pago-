import { MercadoPagoConfig, Payment, PaymentRefund } from 'mercadopago';
import { Request, Response, response } from 'express';
import mercadopago from 'mercadopago';

const publicKey = 'APP_USR-e2eb2128-06a6-4f94-9ce2-34d421d404d7';
const accessToken = 'APP_USR-614050023148920-101215-b1e37c817c6022a15025b51640b1152d-1185798377';

const client = new MercadoPagoConfig({
  accessToken,
});
const payment = new Payment(client);


// Rota para processar um pagamento Pix
export const pagamento = async (req: Request, res: Response) => {
  console.log('oiii');

  const paymentData = {
    transaction_amount: 0.9, // Valor do pagamento Pix
    token: 'pix', // O valor 'pix' indica um pagamento Pix
    description: 'ola', // Descrição do pagamento Pix
    installments: 1, // O pagamento Pix normalmente não envolve parcelamento, então usamos 1 aqui
    payment_method_id: 'pix', // Identificador do método de pagamento Pix
    notification_url: 'https://d6f2-2804-14c-b381-456b-d9db-c890-6c73-70c5.ngrok.io/pago',
    payer: {
      email: 'conato.leoptrcn@gmail.com', // E-mail do pagador (substitua pelo e-mail real)
      identification: {
        type: 'CPF', // Tipo de documento de identificação (exemplo: CPF)
        number: '07656285890', // Número do documento de identificação (substitua pelo número real)
      },
    },
  };
  const idempotencyKey = 'aqui-vai-o-sdadsdsadasdsdsadsadsasddasdadasddssssadasdsdaddasdeu-valor-unico';
  const requestOptions = { idempotencyKey };

  try {
    // Crie o pagamento usando a API do Mercado Pago
    const result = await payment.create({ body: paymentData, requestOptions });

    const ticket_url =  result?.point_of_interaction?.transaction_data?.ticket_url
    const ticket_pix =  result?.point_of_interaction?.transaction_data?.qr_code
    const ticket_QrCode =  result?.point_of_interaction?.transaction_data?.qr_code_base64

    if (ticket_url) {
      console.log("URL do pagamento", ticket_url);
      console.log("PIX COPIA E COLA do pagamento", ticket_pix);
      console.log("QR CODE do pagamento", ticket_QrCode)
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
};



export const processPayment = async (req: Request, res: Response) => {
  try {
    const id: string | undefined = req.query.id as string | undefined;


    if (!id) {
      return res.status(400).json({ error: 'ID do pagamento não fornecido' });
    }

    const paymentDetails = await payment.get({id});

    console.log('Detalhes do pagamento:', paymentDetails.status);

    res.json({ status: paymentDetails.status });
  } catch (error) {
    console.error('Erro ao obter detalhes do pagamento:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
};