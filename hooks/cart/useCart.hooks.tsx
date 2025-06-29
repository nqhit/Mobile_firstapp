// hooks/useCart.ts
import { getCart } from '@/server/cart.server';
import { useCallback } from 'react';

interface UseCartParams {
  accessToken: string;
  axiosJWT: any;
}

function useCart({ accessToken, axiosJWT }: UseCartParams) {
  const fetchCartItems = useCallback(async () => {
    try {
      const res = await getCart(accessToken, axiosJWT);
      return res;
    } catch (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      return null;
    }
  }, []);

  return { fetchCartItems };
}

export default useCart;
