import createProviderServiceController from "./CreateProviderService";
import createServiceController from "./CreateService";
import deleteProviderServiceController from "./DeleteProviderService";
import getAllProviderServiceController from "./GetAllProviderService";
import getOneProviderServiceController from "./GetOneProviderService";

const ServiceControllers = {
  createServiceController,
  createProviderServiceController,
  deleteProviderServiceController,
  getAllProviderServiceController,
  getOneProviderServiceController,
};

export default ServiceControllers;
