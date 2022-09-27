import React from 'react';
import Select from 'react-select';
import { METRIC_TYPES } from '../constants/constants';
// import {getFilteredVariants} from "../constants/StaticConstants";

export default class SelectBox extends React.Component {
	state = {
		selectedOption: null,
	};
	selectRef = React.createRef();

	handleChange = selectedOption => {
		this.setState({ selectedOption }, () => {
			this.props.onVariantSelection(selectedOption.varientInfo);
		});
		
	};

	metricChange = (metric) => {
		const v = METRIC_TYPES.filter(met => { return met.value === metric; });
		return v.length > 0 ? v[0].label : metric;
	}
	getFilteredVariants = (variants) => {
		for (let i = 0; i < variants.length; i++) {
			let s = variants[i]
			if (s.availabilityCount <= 0) {
				variants.sort((a, b) => (((a.availabilityCount)) > ((b.availabilityCount))) ? -1 : 1)
				return variants
			}
		}
		return variants;
	}
	render() {
		const selectedvariant = this.props.selectedVariant;
		const variants = this.getFilteredVariants(this.props.varaints);

		//const variants = this.props.varaints;
		const Options = variants.map(variant => {
			return { value: variant.id, label: variant.metricValue + ' ' + this.metricChange(variant.metricType) + ' - Rs. ' + variant.specialOfferPrice + '/-', varientInfo: variant }
		});
		const selectedOption = { value: selectedvariant.id, label: selectedvariant.metricValue + ' ' + this.metricChange(selectedvariant.metricType) + ' - Rs. ' + selectedvariant.specialOfferPrice + '/-' };
		return (
			<Select
				ref={ref => {
					this.selectRef = ref;
				}}
				onInputChange={(value) => { this.selectRef.select.getNextFocusedOption = () => null }}
				value={selectedOption}
				onChange={this.handleChange}
				options={Options}
				className="variant-drp"
				classNamePrefix='filter'
				isSearchable={false}
				autoFocusOption={false}
				// menuIsOpen={true}
			// styles={{ menu: (base) => ({ ...base, marginBottom: 76 }) }}
			/>
		);
	}
	
}