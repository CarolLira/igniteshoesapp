import { createContext, useState, ReactNode, useEffect } from 'react';

import {
  StorageCartProps,
  storageProductSave,
  storageProductRemove,
  storageProductGetAll,
} from '../storage/storageCart';

import { tagCartUpdate } from '../notifications/notificationTags';

export type CartContextDataProps = {
  addProductCart: (newProduct: StorageCartProps) => Promise<void>;
  removeProductCart: (productId: string) => Promise<void>;
  cart: StorageCartProps[];
  sumProducts: (products: StorageCartProps[]) => number;
}

type CartContextProviderProps = {
  children: ReactNode;
}

export const CartContext = createContext<CartContextDataProps>({} as CartContextDataProps);

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cart, setCart] = useState<StorageCartProps[]>([]);

  async function addProductCart(newProduct: StorageCartProps) {
    try {
      const storageResponse = await storageProductSave(newProduct);
      setCart(storageResponse);
      handleUpdateTagCart();
    } catch (error) {
      throw error;
    }
  }

  async function removeProductCart(productId: string) {
    try {
      const response = await storageProductRemove(productId);
      setCart(response);
      handleUpdateTagCart();
    } catch (error) {
      throw error;
    }
  }

  async function handleUpdateTagCart() {
    try {
      const productsList = await storageProductGetAll();
      const productsQuantity = sumProducts(productsList);
      tagCartUpdate(productsQuantity.toString());
    } catch (error) {
      throw error;
    }
  }

  function sumProducts(products: StorageCartProps[]) {
    return products.reduce((accumulator, current) => accumulator + current.quantity, 0);
  } 

  useEffect(() => {
    storageProductGetAll()
      .then(products => setCart(products))
      .catch(error => console.log(error));
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      addProductCart,
      removeProductCart,
      sumProducts,
    }}>
      {children}
    </CartContext.Provider>
  )
}