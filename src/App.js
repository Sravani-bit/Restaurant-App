// App.js
import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import Cart from './components/Cart'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = dish => {
    this.setState(prevState => {
      const existingItem = prevState.cartList.find(
        item => item.dish_id === dish.dish_id,
      )
      if (existingItem) {
        return {
          cartList: prevState.cartList.map(item =>
            item.dish_id === dish.dish_id
              ? {...item, quantity: item.quantity + 1}
              : item,
          ),
        }
      }
      return {
        cartList: [...prevState.cartList, {...dish, quantity: 1}],
      }
    })
  }

  removeCartItem = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(item => item.dish_id !== id),
    }))
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(item =>
        item.dish_id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    }))
  }

  decrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList
        .map(item =>
          item.dish_id === id ? {...item, quantity: item.quantity - 1} : item,
        )
        .filter(item => item.quantity > 0),
    }))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList} = this.state
    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </CartContext.Provider>
    )
  }
}

export default App
