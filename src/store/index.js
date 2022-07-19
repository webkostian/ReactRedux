// Импорт редюсеров созданных с помощью createSlice
import heroes from "../components/heroesList/heroesSlice";
import filters from "../components/heroesFilters/filtersSlice";
// Способ подключения Стора без Toolkit
// import { createStore, combineReducers, compose, applyMiddleware } from "redux";
// import thunk from "redux-thunk";

// Способ подключения Стора c Toolkit
import { configureStore } from "@reduxjs/toolkit";

// Собственный Middleware. Он позволяет пердавать в dispetch (принято называть next)
// строку. 
const stringMiddleware = () => (next) => (action) => {
  if (typeof action === "string") {
    return next({
      type: action,
    });
  }
  return next(action);
};

// Способ подключения Стора без Toolkit
// const store = createStore(
//                     combineReducers({heroes, filters}),
//                     compose(applyMiddleware(thunk, stringMiddleware),
//                             window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//                     );

// Способ подключения Стора c Toolkit
const store = configureStore(
    { 
        reducer: { heroes, filters },        
        middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),  
        devTools:process.env.ENV !== 'production',


    });

export default store;
