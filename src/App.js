import {Component} from 'react'
import './App.css'

class App extends Component {
  state = {
    itemsList: [],
    cartItems: {},
    selectedCategory: 'Salads and Soup',
    restaurantName: '',
  }

  componentDidMount() {
    this.getitemsData()
  }

  getitemsData = async () => {
    const response = await fetch(
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details',
    )
    const data = await response.json()
    const restaurantData = data[0]
    const initialCartItems = {}
    restaurantData.table_menu_list.forEach(category => {
      category.category_dishes.forEach(dish => {
        initialCartItems[dish.dish_id] = 0
      })
    })

    this.setState({
      itemsList: restaurantData.table_menu_list,
      restaurantName: restaurantData.restaurant_name,
      cartItems: initialCartItems,
    })
  }

  setSelectedCategory = category => {
    this.setState({selectedCategory: category})
  }

  addToCart = dishId => {
    this.setState(prevState => ({
      cartItems: {
        ...prevState.cartItems,
        [dishId]: prevState.cartItems[dishId] + 1,
      },
    }))
  }

  removeFromCart = dishId => {
    this.setState(prevState => ({
      cartItems: {
        ...prevState.cartItems,
        [dishId]: Math.max(prevState.cartItems[dishId] - 1, 0),
      },
    }))
  }

  render() {
    const {itemsList, cartItems, selectedCategory, restaurantName} = this.state

    const items = itemsList.length ? itemsList : []

    const selectedCategoryList = items.find(
      each => each.menu_category === selectedCategory,
    ) || {
      category_dishes: [],
    }

    return (
      <div className="bg-container">
        <div className="header-container">
          <h1 className="restaurant_name">{restaurantName}</h1>

          <div className="cart_items">
            <p>My Orders</p>
            <p>
              {Object.values(cartItems).filter(quantity => quantity > 0).length}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <ul className="category_slider">
            {items.map(each => (
              <li key={each.menu_category}>
                <button
                  onClick={() => this.setSelectedCategory(each.menu_category)}
                >
                  {each.menu_category}
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedCategoryList.category_dishes.map(each => (
          <div className="item_container" key={each.dish_id}>
            <div
              className={`veg-nonveg-indicator ${
                each.dish_Type === 2 ? 'non-veg' : 'veg'
              }`}
            >
              .
            </div>
            <div className="dish_text">
              <h1 className="dish_name">{each.dish_name}</h1>
              <p className="dish_price">{`${each.dish_currency} ${each.dish_price}`}</p>
              <p className="dish_description">{each.dish_description}</p>

              {each.dish_Availability ? (
                <div>
                  <div className="add-container">
                    <button
                      className="increase_decrease"
                      onClick={() => this.removeFromCart(each.dish_id)}
                    >
                      -
                    </button>
                    <p className="dish_quantity">{cartItems[each.dish_id]}</p>
                    <button
                      className="increase_decrease"
                      onClick={() => this.addToCart(each.dish_id)}
                    >
                      +
                    </button>
                  </div>
                  {each.addonCat.length > 0 && (
                    <p className="customization">Customizations available</p>
                  )}
                </div>
              ) : (
                <p>Not Available</p>
              )}
            </div>
            <p className="dish_calories">{`${each.dish_calories} calories`}</p>
            <img src={each.dish_image} alt={each.dish_name} />
          </div>
        ))}
      </div>
    )
  }
}

export default App
