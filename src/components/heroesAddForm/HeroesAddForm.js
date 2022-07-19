// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров
import {
  Formik,
  Form,
  Field,
  //   ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { heroCreated } from "../heroesList/heroesSlice";
import { v4 as uuidv4 } from "uuid";
import { fetchFilters, selectAll } from "../heroesFilters/filtersSlice";
// import store from "../../store";

const HeroesAddForm = () => {
  // Получаем массив фильтров
  // Способ 1
  const filters = useSelector(selectAll);
  // Способ 2
  //const filters = selectAll(store.getState());
  const { heroesLoadingStatus } = useSelector((state) => state.heroes);
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchFilters(request));

    // eslint-disable-next-line
  }, []);

  const onAdd = (hero) => {
    request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
      .then((res) => console.log(res, "Отправка успешна"))
      .then(dispatch(heroCreated(hero)))
      .catch((err) => console.log(err));
  };

  const View = (filters) => {
    return filters.map((element) => {
      return (
        <option key={element.name} value={element.name}>
          {element.label || "Я владею элементом..."}
        </option>
      );
    });
  };
  const elements = View(filters);
  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        element: "all",
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("This field is required"),
        description: Yup.string().required("This field is required"),
      })}
      onSubmit={(hero, { resetForm }) => {
        hero.id = uuidv4();
        onAdd(hero);
        resetForm({
          name: "",
          description: "",
          element: "all",
        });
      }}
    >
      <Form className="border p-4 shadow-lg rounded">
        <div className="mb-3">
          <label htmlFor="name" className="form-label fs-4">
            Имя нового героя
          </label>
          <Field
            required
            type="text"
            name="name"
            className="form-control"
            id="name"
            placeholder="Как меня зовут?"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fs-4">
            Описание
          </label>
          <Field
            required
            name="description"
            className="form-control"
            id="text"
            placeholder="Что я умею?"
            style={{ height: "130px" }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="element" className="form-label">
            Выбрать элемент героя
          </label>
          <Field
            as="select"
            required
            className="form-select"
            id="element"
            name="element"
          >
            {elements}
          </Field>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={heroesLoadingStatus === "loading"}
        >
          Создать
        </button>
      </Form>
    </Formik>
  );
};

export default HeroesAddForm;
