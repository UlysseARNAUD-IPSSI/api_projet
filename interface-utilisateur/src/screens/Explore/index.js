import styles from './index.module.css';
import {useState, useEffect} from 'react';

function Explore(props) {

    const {config, trans} = props;

    function onSubmitRemoteRetrieve(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const {action, method, elements} = form;
        const params = {...elements};
        for (const _key in params) {
            if (Number.isInteger(+_key) || !params[_key].name) {
                delete params[_key];
                continue;
            }
            params[_key] = params[_key].value;
        }
        fetch(`${action}?${new URLSearchParams(params)}`, {method})
            .then(() => alert('Récupération réussie.'))
            .catch(() => alert('Erreur lors de la récupération.'));
        return false;
    }

    function onSubmitRemoteProductsCreate(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const {action, method, elements} = form;
        const params = {...elements};
        for (const _key in params) {
            if (Number.isInteger(+_key) || !params[_key].name) {
                delete params[_key];
                continue;
            }
            params[_key] = params[_key].value;
        }
        const {url, product_name, brands} = params;
        if (!url || !product_name || !brands) {
            alert("L'URL, le nom du produit et la marque doivent être définis.");
        } else fetch(action, {method, body: JSON.stringify(params)})
            .then(() => alert('Création réussie.'))
            .catch(() => alert('Erreur lors de la création.'));
        return false;
    }

    function onSubmitRemoteProductsUpdate(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const {action, method, elements} = form;
        const params = {...elements};
        for (const _key in params) {
            if (Number.isInteger(+_key) || !params[_key].name) {
                delete params[_key];
                continue;
            }
            params[_key] = params[_key].value;
        }
        const {url, product_name, brands,_id} = params;
        delete params._id;
        if (!url || !product_name || !brands) {
            alert("L'URL, le nom du produit et la marque doivent être définis.");
        } else fetch(action.replace(':id', _id), {method, body: JSON.stringify(params)})
            .then(() => alert('Mise à jour réussie.'))
            .catch(() => alert('Erreur lors de la mise à jour.'));
        return false;
    }

    function onSubmitRemoteProductsDelete(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const {action, method, elements} = form;
        const params = {...elements};
        for (const _key in params) {
            if (Number.isInteger(+_key) || !params[_key].name) {
                delete params[_key];
                continue;
            }
            params[_key] = params[_key].value;
        }
        const {_id} = params;
        delete params._id;
        fetch(action.replace(':id', _id), {method})
            .then(() => alert('Suppression réussie.'))
            .catch(() => alert('Erreur lors de la suppression.'));
        return false;
    }

    function onSubmitRemoteCategoriesCreate(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const {action, method, elements} = form;
        const params = {...elements};
        for (const _key in params) {
            if (Number.isInteger(+_key) || !params[_key].name) {
                delete params[_key];
                continue;
            }
            params[_key] = params[_key].value;
        }
        fetch(action, {method, body: JSON.stringify(params)})
            .then(() => alert('Création réussie.'))
            .catch(() => alert('Erreur lors de la création.'));
        return false;
    }

    function onSubmitRemoteCategoriesUpdate(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const {action, method, elements} = form;
        const params = {...elements};
        for (const _key in params) {
            if (Number.isInteger(+_key) || !params[_key].name) {
                delete params[_key];
                continue;
            }
            params[_key] = params[_key].value;
        }
        const {_id} = params;
        delete params._id;
        fetch(action.replace(':id', _id), {method, body: JSON.stringify(params)})
            .then(() => alert('Mise à jour réussie.'))
            .catch(() => alert('Erreur lors de la mise à jour.'));
        return false;
    }

    function onSubmitRemoteCategoriesDelete(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const {action, method, elements} = form;
        const params = {...elements};
        for (const _key in params) {
            if (Number.isInteger(+_key) || !params[_key].name) {
                delete params[_key];
                continue;
            }
            params[_key] = params[_key].value;
        }
        const {_id} = params;
        delete params._id;
        fetch(action.replace(':id', _id), {method})
            .then(() => alert('Suppression réussie.'))
            .catch(() => alert('Erreur lors de la suppression.'));
        return false;
    }

    return <>
        <section className={styles.section}>

            <form
                method="GET" action={config('api.endpoint') + '/remote/retrieve'}
                onSubmit={onSubmitRemoteRetrieve}>
                <fieldset>
                    <legend>Recupération des produits</legend>
                    <label>
                        <span>Nombre de pages</span>
                        <input name="pages" type="number" min="1" defaultValue="1"/>
                    </label>
                    <label>
                        <span>Elements par page</span>
                        <input name="page_size" type="number" min="1" defaultValue="12"/>
                    </label>
                    <label>
                        <span>Page de départ</span>
                        <input name="start" type="number" min="1" defaultValue="1"/>
                    </label>
                    <button>Valider</button>
                </fieldset>
            </form>

            <form
                method="POST" action={config('api.endpoint') + '/remote/products/create'}
                onSubmit={onSubmitRemoteProductsCreate}>
                <fieldset>
                    <legend>Création d'un produit</legend>
                    <label>
                        <span>Nom</span>
                        <input name="product_name" type="text"/>
                    </label>
                    <label>
                        <span>Nom (français)</span>
                        <input name="product_name_fr" type="text"/>
                    </label>
                    <label>
                        <span>Marque</span>
                        <input name="brands" type="text" defaultValue="une marque, une autre marque"/>
                    </label>
                    <label>
                        <span>URL</span>
                        <input name="url" type="text" defaultValue="#"/>
                    </label>
                    <label>
                        <span>Nutrition grade</span>
                        <input name="nutrition_grade_fr" type="text"/>
                    </label>
                    <label>
                        <span>Catégories</span>
                        <input name="categories" type="text"/>
                    </label>
                    <label>
                        <span>Image</span>
                        <input name="image_url" type="text"/>
                    </label>
                    <label>
                        <span>Vignette</span>
                        <input name="image_thumb_url" type="text"/>
                    </label>
                    <button>Valider</button>
                </fieldset>
            </form>

            <form
                method="POST" action={config('api.endpoint') + '/remote/products/:id/update'}
                onSubmit={onSubmitRemoteProductsUpdate}>
                <fieldset>
                    <legend>Mis à jour d'un produit</legend>
                    <label>
                        <span>Nom</span>
                        <input name="product_name" type="text"/>
                    </label>
                    <label>
                        <span>Nom (français)</span>
                        <input name="product_name_fr" type="text"/>
                    </label>
                    <label>
                        <span>Marque</span>
                        <input name="brands" type="text" defaultValue="une marque, une autre marque"/>
                    </label>
                    <label>
                        <span>URL</span>
                        <input name="url" type="text" defaultValue="#"/>
                    </label>
                    <label>
                        <span>Nutrition grade</span>
                        <input name="nutrition_grade_fr" type="text"/>
                    </label>
                    <label>
                        <span>Catégories</span>
                        <input name="categories" type="text"/>
                    </label>
                    <label>
                        <span>Image</span>
                        <input name="image_url" type="text"/>
                    </label>
                    <label>
                        <span>Vignette</span>
                        <input name="image_thumb_url" type="text"/>
                    </label>
                    <button>Valider</button>
                </fieldset>
            </form>

            <form
                method="GET" action={config('api.endpoint') + '/remote/products/:id/delete'}
                onSubmit={onSubmitRemoteProductsDelete}>
                <fieldset>
                    <legend>Suppression d'un produit</legend>
                    <label>
                        <span>Identifiant</span>
                        <input name="_id" type="text"/>
                    </label>
                    <button>Valider</button>
                </fieldset>
            </form>

            <form
                method="POST" action={config('api.endpoint') + '/remote/categories/create'}
                onSubmit={onSubmitRemoteCategoriesCreate}>
                <fieldset>
                    <legend>Création d'une catégorie</legend>
                    <label>
                        <span>Nom</span>
                        <input name="name" type="text"/>
                    </label>
                    <button>Valider</button>
                </fieldset>
            </form>

            <form
                method="POST" action={config('api.endpoint') + '/remote/categories/:id/update'}
                onSubmit={onSubmitRemoteCategoriesUpdate}>
                <fieldset>
                    <legend>Mise à jour d'une catégorie</legend>
                    <label>
                        <span>Identifiant</span>
                        <input name="_id" type="text"/>
                    </label>
                    <label>
                        <span>Nom</span>
                        <input name="name" type="text"/>
                    </label>
                    <button>Valider</button>
                </fieldset>
            </form>

            <form
                method="GET" action={config('api.endpoint') + '/remote/categories/:id/delete'}
                onSubmit={onSubmitRemoteCategoriesDelete}>
                <fieldset>
                    <legend>Suppression d'une catégorie</legend>
                    <label>
                        <span>Identifiant</span>
                        <input name="_id" type="text"/>
                    </label>
                    <button>Valider</button>
                </fieldset>
            </form>

        </section>
    </>;
}

export default Explore;
