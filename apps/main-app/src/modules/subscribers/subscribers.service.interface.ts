
import CreateSubscriberDto from './dtos/add-subscriber.dto';

interface Subscriber {
    id: number;
    email: string;
    name: string;
  }
 
interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>
  getAllSubscribers(params: {}): Promise<{data: Subscriber[]}>
}
 
export default SubscribersService;