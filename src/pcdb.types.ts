export interface BreResponse {
	data: unknown[];
	TestData: unknown[];
	productType: string;
}

export interface BreAirSourceHeatPumpData {
	ID: number;
	heat_exchanger_surface_area_declared?: number;
	temp_return_feed_max?: number;
	daily_losses_declared?: number;
	temp_lower_operating_limit?: number;
	modulatingControl: number;
	power_off?: number;
	service_provision?: number;
	energySupply: string;
	backupCtrlType: string;
	brand: string;
	var_flow_temp_ctrl_during_test: number;
	power_max_backup?: number;
	minimum_modulation_rate_20?: number;
	minimum_modulation_rate_35?: number;
	power_standby: number;
	dataType?: string;
	modelQualifier?: string;
	power_source_circ_pump?: number;
	power_heating_circ_pump?: number;
	power_crankcase_heater?: number;
	power_heating_warm_air_fan?: number;
	modelName: string;
	sourceType: string;
	vessel_type?: string;
	tank_volume_declared?: number;
	time_constant_onoff_operation?: number;
	sinkType: string;
	min_temp_diff_flow_return_for_hp_to_operate?: number;
	standardRatingCapacity20C?: string;
	standardRatingCapacity35C?: string;
	standardRatingCapacity55C?: string;
}

export interface BreAirSourceHeatPumpTestData {
	ID: number;
	parentID: number;
	productID: number;
	degradation_coeff: number;
	test_letter: string;
	temp_test: number;
	cop: number;
	design_flow_temp: number;
	temp_source: number;
	temp_outlet: number;
	capacity: number;
}