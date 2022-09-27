import TYPE from '../types/category';
import UTYPE from '../types/util';
import api from './root';
import service from './index';

export class CategoryService {

    getCategoryPageData = (slug, storeId) => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                api.getData('/public/category/slug/' + slug.params.slug, storeId)
                    .then((response) => {
                        dispatch({
                            type: TYPE.RES_CATEGORY_PAGE_DATA,
                            data: {slug: slug.params.slug, info: response},
                        });
                        dispatch(service.emptyHomeData());
                        resolve(dispatch(service.emptyProductPage()));
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

    getCategoryPageDataSSR = (slug, storeId) => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                api.getData('/public/category/slug/' + slug.params.slug, storeId)
                    .then((response) => {
                        dispatch({
                            type: TYPE.RES_CATEGORY_PAGE_DATA,
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

    emptyCategoryData = () => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				dispatch({
					type:TYPE.EMPTY_CAT_DATA,
					data: ""
				});	
				resolve();
			});
		};
	}
}
