import {Link, withRouter} from 'react-router-dom'
import {IoCartOutline} from 'react-icons/io5'
import Cookies from 'js-cookie'
import CartContext from '../../context/CartContext'
import './index.css'

const Header = props => {
  const {history} = props

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <CartContext.Consumer>
      {({cartList}) => {
        const cartCount = cartList.reduce((acc, item) => acc + item.quantity, 0)

        return (
          <nav className="header">
            <h1 className="logo" onClick={() => history.push('/')}>
              UNI Resto Cafe
            </h1>
            <div>
              <Link to="/">Home</Link>
              <Link to="/cart">
                <button>
                  <IoCartOutline size={24} />
                </button>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>

              <button onClick={onLogout}>Logout</button>
            </div>
          </nav>
        )
      }}
    </CartContext.Consumer>
  )
}

export default withRouter(Header)
