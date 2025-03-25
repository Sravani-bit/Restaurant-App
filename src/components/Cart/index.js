import {Component} from 'react'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import './index.css'

class Cart extends Component {
  render() {
    return (
      <CartContext.Consumer>
        {value => {
          const {cartList, removeCartItem, removeAllCartItems} = value

          return (
            <div>
              <Header />
              <h1>Cart</h1>
              {cartList.length === 0 ? (
                <div className="empty-cart-container">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
                    alt="empty cart"
                  />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div>
                  <button type="button" onClick={removeAllCartItems}>
                    Remove All
                  </button>
                  <ul>
                    {cartList.map(dish => (
                      <li key={dish.id} className="cart-item">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="cart-item-image"
                        />
                        <div className="cart-item-details">
                          <p className="cart-item-name">{dish.name}</p>
                          <p className="cart-item-quantity">
                            Quantity: {dish.quantity}
                          </p>
                          <button
                            onClick={() => removeCartItem(dish.id)}
                            className="remove-item-button"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={removeAllCartItems}
                    className="remove-all-button"
                  >
                    Remove All
                  </button>
                </div>
              )}
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default Cart
