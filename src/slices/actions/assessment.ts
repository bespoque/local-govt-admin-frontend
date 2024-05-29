import api from "api";

export const fetchRevHeads = async (data) => {
  return api.post(`/assessment/AssessmentRevenueHeads.php`, data);
};
export const fetchCategories = async (data) => {
  return api.post(`/assessment/AssessmentRevenueHeadCategories.php`, data);
};
export const fetchItems = async (data) => {
  return api.post(`/assessment/AssessmentRevenueHeadCategoryItems.php`, data);
};
