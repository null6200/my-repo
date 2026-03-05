/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: skincareproducts
 * @catalog This collection is an eCommerce catalog
 * Interface for SkincareProducts
 */
export interface SkincareProducts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType number */
  phLevel?: number;
  /** @wixFieldType text */
  keyIngredients?: string;
  /** @wixFieldType text */
  skinTypeRecommendation?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  textureShot?: string;
  /** @wixFieldType text */
  inventoryStatus?: string;
  /** @wixFieldType number */
  stockQuantity?: number;
}

/**
 * Collection ID: orders
 * Interface for Orders
 */
export interface Order {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  customerName?: string;
  /** @wixFieldType text */
  customerEmail?: string;
  /** @wixFieldType text */
  customerPhone?: string;
  /** @wixFieldType text */
  shippingAddress?: string;
  /** @wixFieldType text */
  city?: string;
  /** @wixFieldType text */
  state?: string;
  /** @wixFieldType text */
  country?: string;
  /** @wixFieldType text */
  postalCode?: string;
  /** @wixFieldType number */
  totalAmount?: number;
  /** @wixFieldType text */
  orderStatus?: string;
  /** @wixFieldType text */
  paymentStatus?: string;
  /** @wixFieldType text */
  paystackReference?: string;
  /** @wixFieldType text */
  orderItems?: string;
}
