import { TestBed } from '@angular/core/testing';

import { SocketServiceService } from './socket-service.service';

describe('SocketServiceService', () => {
  let service: SocketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('SocketServiceService', () => {
  let service: SocketServiceService;
  it('should connect to socket server', () => {
    const socket = service.socket;
    expect(socket).toBeDefined();
    expect(socket.connected).toBeTruthy();
  });

  it('should emit message on receive', (done) => {
    const message = 'test message';
    const socket = service.socket;
    service.getNewMessage().subscribe(received => {
      expect(received).toBe(message);
      done();
    });
    socket.emit('message', message);
  });

  it('should send SMS', () => {
    const phone = '123';
    const code = '456';
    service.sendsms(phone, code).subscribe(response => {
      expect(response.ok).toBeTruthy();
    });
  });

  it('should get auction', () => {
    const id = 1;
    service.getAuction(id).subscribe(auction => {
      expect(auction.id).toBe(id);
    });
  });

  it('should get order', () => {
    const id = 1;
    service.getOrder(id).subscribe(order => {
      expect(order.id).toBe(id);
    });
  });

  it('should get user orders', () => {
    const userId = 1;
    service.getUserOrder(userId).subscribe(orders => {
      expect(orders.length).toBeGreaterThanOrEqual(0);
      orders.forEach(order => {
        expect(order.userId).toBe(userId);
      });
    });
  });

});
 