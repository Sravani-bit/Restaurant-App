import {Component} from 'react'
import CartContext from '../../context/CartContext'
import './index.css'

class CartItem extends Component {
  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {
            removeCartItem,
            incrementCartItemQuantity,
            decrementCartItemQuantity,
          } = value
          const {itemDetails} = this.props
          const {dishId, dishName, dishImage, dishPrice, quantity} = itemDetails

          const onIncrement = () => {
            incrementCartItemQuantity(dishId)
          }

          const onDecrement = () => {
            decrementCartItemQuantity(dishId)
          }

          const onRemove = () => {
            removeCartItem(dishId)
          }

          return (
            <li className="cart-item">
              <img src={dishImage} alt={dishName} className="cart-item-image" />
              <div className="cart-item-details">
                <h1 className="cart-item-title">{dishName}</h1>
                <div className="quantity-controller">
                  <button type="button" onClick={onDecrement}>
                    -
                  </button>
                  <p className="quantity">{quantity}</p>
                  <button type="button" onClick={onIncrement}>
                    +
                  </button>
                </div>
                <p className="cart-item-price">₹{dishPrice * quantity}</p>
                <button type="button" className="remove-btn" onClick={onRemove}>
                  Remove
                </button>
              </div>
            </li>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default CartItem
