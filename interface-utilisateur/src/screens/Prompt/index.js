import styles from './index.module.css';
import {useState, useEffect} from 'react';

function Prompt(props) {

    const {config, trans} = props;

    const DEFAULT_ACTION = config('api.endpoint') + '/products/search/:type/:value';
    const ACTION_CATEGORIES = config('api.endpoint') + '/categories/search/:value';

    const [type, setType] = useState('product_name');
    const [value, setValue] = useState('');
    const [method, setMethod] = useState('GET');
    const [action, setAction] = useState(DEFAULT_ACTION);

    const [timeoutSearch,setTimeoutSearch] = useState(null);

    useEffect(() => {
        const form = document.forms.namedItem('search');
        const {value: input} = form.elements;
        input.setAttribute('list', 'category' === type ? 'categories' : '');
    }, [type]);

    useEffect(() => {
        if (timeoutSearch) {
            clearTimeout(timeoutSearch);
            setTimeoutSearch(null);
        }

        const section = document.querySelector(`.${styles.section}`);
        const subsection = section.querySelector('[role="feed"]');

        const datalistCategories = document.querySelector('datalist#categories');

        if (!value || !type) {
            subsection.querySelectorAll('article[data-id]').forEach(article => {
                article.hidden = true;
            });
            return;
        }

        let _action = action.toString().replace(':type', type).replace(':value', value);

        const headers = {};
        const originalArticles = {
            product: subsection.querySelector(`template > article[data-name="product"]`),
            brand: subsection.querySelector(`template > article[data-name="product"]`),
            category: subsection.querySelector(`template > article[data-name="category"]`),
        }

        setTimeoutSearch(setTimeout(async ()=>{
            await fetch(_action, {method, headers})
                .then(response => response.json())
                .then(async ({message, data}) => {

                    subsection.querySelectorAll('article[data-id]').forEach(article => {
                        article.hidden = true;
                    });

                    if (data.products) {
                        for (let product of data.products) {
                            let toAdd = false;
                            const {_id, product_name, brands, categories, created_t, image_thumb_url} = product;
                            let article = subsection.querySelector(`article[data-name="product"][data-id="${_id}"]`)
                            if (!article) {
                                article = originalArticles.product.cloneNode(true);
                                toAdd = true;
                            }
                            const nameElement = article.querySelector(`dd[role="heading"]`);
                            nameElement.innerHTML = product_name;
                            const brandsElement = nameElement.nextElementSibling;
                            brandsElement.innerHTML = brands;
                            const image = article.querySelector('img');
                            image.alt = product_name;
                            image.src = image_thumb_url;
                            const dateElement = article.querySelector('time');
                            dateElement.innerHTML = new Date(+created_t).toLocaleString('fr-FR', {
                                weekday: "long", year: "numeric", month: "long", day: "numeric"
                            });

                            let productCategories = [];

                            for (let _category of categories) {
                                await fetch(`${config('api.endpoint')}/categories/get/${_category}`, {method: 'GET'})
                                    .then(res => res.json())
                                    .then(({data}) => {
                                        let {name} = data;
                                        name = name.trim()
                                        const elements = Array.from(datalistCategories.childNodes).map(element => element.value ?? undefined).filter(element => !!element);
                                        if (-1 < elements.indexOf(name)) return;
                                        const element = document.createElement('option');
                                        element.value = name;
                                        datalistCategories.appendChild(element);
                                        productCategories.push(name);
                                    }).catch(reason => {});
                            }

                            const {nextElementSibling: categoriesElement} = nameElement.parentElement;
                            categoriesElement.innerHTML = productCategories.join(', ');

                            article.dataset.id = _id;
                            if (toAdd) subsection.appendChild(article);
                            else article.hidden = false;
                        }
                    }

                    if (data.categories) {
                        for (let category of data.categories) {
                            let toAdd = false;
                            let {_id, name, products, created_t} = category;
                            name = name.trim();
                            let article = subsection.querySelector(`article[data-name="category"][data-id="${_id}"]`)
                            if (!article) {
                                article = originalArticles.category.cloneNode(true);
                                toAdd = true;
                            }
                            const heading = article.querySelector(`dd[role="heading"]`);
                            heading.innerHTML = name;
                            const dateElement = article.querySelector('time');
                            dateElement.innerHTML = new Date(+created_t).toLocaleString('fr-FR', {
                                weekday: "long", year: "numeric", month: "long", day: "numeric"
                            });
                            article.dataset.id = _id;
                            if (toAdd) subsection.appendChild(article);
                            else article.hidden = false;
                            for (let _product of products) {
                                const articleProduct = subsection.querySelector(`article[data-name="product"][data-id="${_product}"]`);
                                if (articleProduct) articleProduct.hidden = false;
                            }

                            const elements = Array.from(datalistCategories.childNodes).map(element => element.value ?? undefined).filter(element => !!element);
                            if (-1 < elements.indexOf(name)) return;
                            const element = document.createElement('option');
                            element.value = name;
                            datalistCategories.appendChild(element);
                        }
                    }

                });
        }, 1000))
    }, [type, value]);

    function onKeyDown(event) {
        const {key} = event;
        if ('enter' === key.toLowerCase()) return false;
    }

    function onSubmit(event) {
        event.preventDefault();
        return false;
    }

    function onInput(event) {
        setValue(event.target.value.trim());
    }

    function onChangeSelect(event) {
        const {value: _value} = event.target;
        setType(_value.trim());

        if ('category' === _value.trim()) {
            setAction(ACTION_CATEGORIES);
            return;
        }

        setAction(DEFAULT_ACTION);
    }

    return <>
        <section className={styles.section}>

            <aside>
                <form action={action} method={method} onSubmit={onSubmit} name="search">
                    <select name="type" onChange={onChangeSelect}>
                        <option value="product_name">Nom du produit</option>
                        <option value="category">Catégorie</option>
                        <option value="brands">Marque</option>
                    </select>
                    <input type="text" name="value" onKeyDown={onKeyDown} onInput={onInput}/>
                    <datalist id="categories"></datalist>
                </form>

                <section role="feed">
                    <template>
                        <article data-name="product" className={styles.article}>
                            <img src="" alt="Nom du produit" loading="lazy"/>
                            <dl role="contentinfo">
                                <div>
                                    <dd role="heading"
                                        aria-label={trans('a11y.search.article.product_name')}>Nom du produit
                                    </dd>
                                    <dd aria-label={trans('a11y.search.article.brands')}>Marque</dd>
                                </div>
                                <p aria-label={trans('a11y.search.article.categories')}>
                                    <dd>Catégories à mettre ici...</dd>
                                </p>
                                <p aria-label={trans('a11y.search.article.date')}>
                                    <dt>Ajouté le</dt>
                                    <dd>
                                        <time>JJ MM YYYY</time>
                                    </dd>
                                </p>
                            </dl>
                        </article>
                    </template>
                    <template>
                        <article data-name="category" className={styles.article}>
                            <dl role="contentinfo">
                                <dd role="heading" aria-label={trans('a11y.search.article.category_name')}>Nom de la
                                    catégorie
                                </dd>
                                <p aria-label={trans('a11y.search.article.date')}>
                                    <dt>Ajouté le</dt>
                                    <dd>
                                        <time>13 décembre 2020</time>
                                    </dd>
                                </p>
                            </dl>
                        </article>
                    </template>
                </section>
            </aside>

        </section>
    </>;
}

export default Prompt;
