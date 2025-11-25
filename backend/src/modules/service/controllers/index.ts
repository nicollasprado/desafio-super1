import createProviderServiceController from "./CreateProviderService";
import createServiceController from "./CreateService";
import deleteProviderServiceController from "./DeleteProviderService";
import getAllProviderServiceController from "./GetAllProviderService";

const ServiceControllers = {
  createServiceController,
  createProviderServiceController,
  deleteProviderServiceController,
  getAllProviderServiceController,
};

export default ServiceControllers;
