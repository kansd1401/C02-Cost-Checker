import axios from "axios";

const base = axios.create({});

export const get_states = async () => {
  try {
    const response = await base.get(`/states`);
    return response.data;
  } catch (error) {
    console.error(error);
  } finally {
  }
};

export const get_states_emissions = async (filters) => {
  try {
    const response = await base.get(`/states/emissions`, {
      params: { ...filters },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  } finally {
  }
};
