export {
  addItem,
  addNewItem,
  deleteItem,
  fullDeleteItem,
  saveShoppingCartToLocalStorage,
  selectItemsInShoppingCart,
  selectTotalPrice,
  selectTotalQuantityItemInShoppingCart,
  shoppingCartReducer,
  shoppingCartSlice,
} from "./model/shoppingCartSlice";
export type { ItemType, ShoppingCartType } from "./model/shoppingCartSlice";
