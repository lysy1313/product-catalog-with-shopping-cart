export {
  addItem,
  addNewItem,
  clearCart,
  deleteItem,
  fullDeleteItem,
  saveShoppingCartToLocalStorage,
  selectItemsInShoppingCart,
  selectRawSubtotal,
  selectTotalDiscount,
  selectTotalPrice,
  selectTotalQuantityItemInShoppingCart,
  shoppingCartReducer,
  shoppingCartSlice,
} from "./model/shoppingCartSlice";
export type { ItemType, ShoppingCartType } from "./model/shoppingCartSlice";
