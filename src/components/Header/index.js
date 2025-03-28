// Header.js
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaCartArrowDown} from 'react-icons/fa'
import './index.css'
import CartContext from '../../context/CartContext'

const Header = props => {
  const {history, restaurantName} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const uniqueItemsCount = cartList.length

        return (
          <nav className="header-container">
            <div className="header-content">
              <Link to="/" className="restaurant-name">
                {restaurantName}
              </Link>
              <div className="header-buttons">
                <Link to="/cart" className="nav-link">
                  <button type="button">
                    <FaCartArrowDown size={25} />
                  </button>
                  {uniqueItemsCount > 0 && (
                    <span className="cart-count-badge" data-testid="cart">
                      {uniqueItemsCount}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  className="logout-button"
                  onClick={onClickLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        )
      }}
    </CartContext.Consumer>
  )
}

export default withRouter(Header)
