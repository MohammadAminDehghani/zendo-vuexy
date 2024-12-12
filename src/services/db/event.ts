import createApiClient from "../callApi";

const apiClient = createApiClient();

export const fetchEvents = async () => {
  const response = await apiClient.get("/events");
  return response?.data?.events?.data;
};

export const createEvent = async (eventData: any) => {
  const response = await apiClient.post("/events", eventData);
  return response?.data;
};

export const joinEvent = async (eventId: Number) => {
  const response = await apiClient.post(`/events/${eventId}/join`, eventId);
  return response?.data;
};

export const leaveEvent = async (eventId: Number) => {
  const response = await apiClient.post(`/events/${eventId}/leave`, eventId);
  return response?.data;
};
