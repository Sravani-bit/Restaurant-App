import {Component} from 'react'
import Header from '../Header'
import './index.css'
import CartContext from '../../context/CartContext'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
const API_STATUS = {
  SUCCESS: 'SUCCESS',
  LOADING: 'LOADING',
  FAILURE: 'FAILURE',
  INITIAL: 'INITIAL',
}

class Home extends Component {
  state = {
    itemsList: [],
    selectedCategory: 'Salads and Soup',
    restaurantName: '',
    apiStatus: API_STATUS.INITIAL,
  }

  componentDidMount() {
    this.getItemsData()
  }

  getItemsData = async () => {
    this.setState({apiStatus: API_STATUS.LOADING})
    try {
      const response = await fetch(API_URL)

      if (response.ok) {
        const data = await response.json()
        const restaurantData = data[0]
        this.setState({
          itemsList: restaurantData.table_menu_list,
          restaurantName: restaurantData.restaurant_name,
          apiStatus: API_STATUS.SUCCESS,
        })
      } else {
        this.setState({apiStatus: API_STATUS.FAILURE})
      }
    } catch (error) {
      this.setState({apiStatus: API_STATUS.FAILURE})
    }
  }

  setSelectedCategory = category => {
    this.setState({selectedCategory: category})
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getItemsData}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <div className="loader">
        <p>...</p>
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {itemsList, selectedCategory, restaurantName} = this.state
    const items = itemsList.length ? itemsList : []

    const selectedCategoryList = items.find(
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
          } = value

          const onClickAddToCart = dish => {
            addCartItem({
              dish_id: dish.dish_id,
              dish_name: dish.dish_name,
              dish_price: dish.dish_price,
              dish_currency: dish.dish_currency,
              dish_image: dish.dish_image,
              quantity: 1,
            })
          }

          const onIncrement = id => {
            incrementCartItemQuantity(id)
          }

          const onDecrement = id => {
            decrementCartItemQuantity(id)
          }

          return (
            <div className="home-container">
              <Header restaurantName={restaurantName} />
              <div className="home-content">
                <h1 className="restaurant-heading">{restaurantName}</h1>

                <ul className="category-slider">
                  {items.map(each => (
                    <li key={each.menu_category}>
                      <button
                        type="button"
                        onClick={() =>
                          this.setSelectedCategory(each.menu_category)
                        }
                        className={`category-button ${
                          selectedCategory === each.menu_category
                            ? 'active'
                            : ''
                        }`}
                      >
                        {each.menu_category}
                      </button>
                    </li>
                  ))}
                </ul>

                {selectedCategoryList.category_dishes.map(each => {
                  const cartDish = cartList.find(
                    item => item.dish_id === each.dish_id,
                  )
                  const quantity = cartDish ? cartDish.quantity : 0

                  return (
                    <div className="item-container" key={each.dish_id}>
                      <div
                        className={`veg-nonveg-indicator ${
                          each.dish_Type === 2 ? 'non-veg' : 'veg'
                        }`}
                      >
                        .
                      </div>
                      <div className="dish-text">
                        <h1 className="dish-name">{each.dish_name}</h1>
                        <p className="dish-price">{`${each.dish_currency} ${each.dish_price}`}</p>
                        <p className="dish-description">
                          {each.dish_description}
                        </p>

                        {each.dish_Availability ? (
                          <div>
                            {quantity === 0 ? (
                              <button
                                type="button"
                                className="add-to-cart-button"
                                onClick={() => onClickAddToCart(each)}
                              >
                                ADD TO CART
                              </button>
                            ) : (
                              <div className="quantity-container">
                                <button
                                  type="button"
                                  className="quantity-button"
                                  onClick={() => onDecrement(each.dish_id)}
                                >
                                  -
                                </button>
                                <p className="quantity-count">{quantity}</p>
                                <button
                                  type="button"
                                  className="quantity-button"
                                  onClick={() => onIncrement(each.dish_id)}
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {each.addonCat.length > 0 && (
                              <p className="customization">
                                Customizations available
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="not-available">Not Available</p>
                        )}
                      </div>
                      <p className="dish-calories">{`${each.dish_calories} calories`}</p>
                      <img
                        src={each.dish_image}
                        alt={each.dish_name}
                        className="dish-image"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case API_STATUS.LOADING:
        return this.renderLoadingView()
      case API_STATUS.SUCCESS:
        return this.renderSuccessView()
      case API_STATUS.FAILURE:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default Home
