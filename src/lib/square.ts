import { SquareClient, SquareEnvironment } from 'square';

const isProduction =
  process.env.SQUARE_API_BASE === 'https://connect.squareup.com';

export const square = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN ?? '',
  environment: isProduction
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
});

export { SquareError } from 'square';
