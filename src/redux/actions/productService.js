import TYPE from '../types/product';
import UTYPE from '../types/util';
import api from './root';
import service from './index';

export class ProductService {

    getProductPageData = (slug, storeId) => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                api.getData('/public/product/slug/' + slug.params.slug, storeId)
                    .then((response) => {
                        dispatch({
                            type: TYPE.RES_PRODUCT_PAGE_DATA,
                            data: {slug: slug.params.slug, info: response},
                        });
                        dispatch(service.emptyCategoryData());
						resolve(dispatch(service.emptyHomeData()));
                    })
                    .catch((error) => {
                        dispatch({
                            type: TYPE.FAIL_DATA,
                            data: error
                        });
                        reject(error);
                    });
            });
        };
    }

    getProductPageDataSSR = (slug, storeId) => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                api.getData('/public/product/slug/' + slug.params.slug, storeId)
                    .then((response) => {
                        dispatch({
                            type: TYPE.RES_PRODUCT_PAGE_DATA,
                            data: {slug: slug.params.slug, info: response},
                        });
                        return api.getData('/public/commondata', '');
                    })
                    .then((res) => {
                        dispatch({
                            type: UTYPE.RES_COMMON_DATA,
                            data: res.responseBody.responseData
                        });
                        resolve();
                    })
                    .catch((error) => {
                        dispatch({
                            type: TYPE.FAIL_DATA,
                            data: error
                        });
                        reject(error);
                    });
            });
        };
    }

    emptyProductPage = () => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				dispatch({
					type:TYPE.EMPTY_PRODUCT_PAGE,
					data: ""
				});	
				resolve();
			});
		};
	}
}
