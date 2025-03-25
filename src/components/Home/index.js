import {Component} from 'react'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'
import CartContext from '../../context/CartContext'
import Header from '../Header'
import './index.css'

class Home extends Component {
  state = {
    itemsList: [],
    selectedCategory: 'Salads and Soup',
    restaurantName: '',
    isLoading: true,
  }

  componentDidMount() {
    this.getItemsData()
  }

  getItemsData = async () => {
    try {
      const response = await fetch(
        'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
      )
      const data = await response.json()

      if (data.length > 0) {
        const restaurantData = data[0]
        this.setState({
          itemsList: restaurantData.table_menu_list,
          restaurantName: restaurantData.restaurant_name,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  setSelectedCategory = category => {
    this.setState({selectedCategory: category})
  }

  render() {
    const {itemsList, selectedCategory, restaurantName, is} = this.state

    const selectedCategoryList = itemsList.find(
      each => each.menu_category === selectedCategory,
    ) || {
      category_dishes: [],
    }

    return (
      <CartContext.Consumer>
        {value => {
          const {
            cartList,
            addCartItem,
            incrementCartItemQuantity,
            decrementCartItemQuantity,
            removeAllCartItems,
          } = value

          const cartCount = cartList.length

          return (
            <div className="bg-container">
              <Header />

              {itemsList.length > 0 && (
                <ul className="category_slider">
                  {itemsList.map(each => (
                    <li key={each.menu_category}>
                      <button
                        className="menu-item button tab-item-button"
                        onClick={() =>
                          this.setSelectedCategory(each.menu_category)
                        }
                      >
                        {each.menu_category}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <ul className="menu-list">
                {selectedCategoryList.category_dishes.map(each => {
                  const cartItem = cartList.find(
                    item => item.id === each.dish_id,
                  )
                  const quantity = cartItem ? cartItem.quantity : 0

                  return (
                    <li className="menu-item" key={each.dish_id}>
                      <div
                        className={`veg-nonveg-indicator ${
                          each.dish_Type === 2 ? 'non-veg' : 'veg'
                        }`}
                      >
                        .
                      </div>
                      <img
                        src={each.dish_image}
                        alt={each.dish_name}
                        className="food-image"
                      />
                      <div className="dish_text">
                        <h2 className="dish_name">{each.dish_name}</h2>
                        <p className="dish_price">{`${each.dish_currency} ${each.dish_price}`}</p>
                        <p className="dish_description">
                          {each.dish_description}
                        </p>

                        {each.dish_Availability ? (
                          <div>
                            <div className="add-container">
                              <button
                                type="button"
                                onClick={() =>
                                  decrementCartItemQuantity(each.dish_id)
                                }
                                disabled={quantity === 0}
                              >
                                -
                              </button>
                              <p>{quantity}</p>
                              <button
                                type="button"
                                onClick={() => {
                                  if (quantity > 0) {
                                    incrementCartItemQuantity(each.dish_id)
                                  } else {
                                    addCartItem({
                                      id: each.dish_id,
                                      name: each.dish_name,
                                      price: each.dish_price,
                                      imageUrl: each.dish_image,
                                      quantity: 1,
                                    })
                                  }
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p>Not Available</p>
                        )}
                      </div>
                      <p className="dish_calories">{`${each.dish_calories} calories`}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default Home
