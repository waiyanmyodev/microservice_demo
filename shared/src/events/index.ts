// Domain Events for Inter-Service Communication

export interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  eventData: any;
  occurredAt: Date;
  version: number;
}

// User Domain Events
export interface UserCreatedEvent extends DomainEvent {
  eventType: 'UserCreated';
  aggregateType: 'User';
  eventData: {
    userId: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface UserUpdatedEvent extends DomainEvent {
  eventType: 'UserUpdated';
  aggregateType: 'User';
  eventData: {
    userId: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface UserDeactivatedEvent extends DomainEvent {
  eventType: 'UserDeactivated';
  aggregateType: 'User';
  eventData: {
    userId: string;
  };
}

// Post Domain Events
export interface PostCreatedEvent extends DomainEvent {
  eventType: 'PostCreated';
  aggregateType: 'Post';
  eventData: {
    postId: string;
    authorId: string;
    title: string;
    slug?: string;
  };
}

export interface PostPublishedEvent extends DomainEvent {
  eventType: 'PostPublished';
  aggregateType: 'Post';
  eventData: {
    postId: string;
    authorId: string;
    title: string;
    publishedAt: Date;
  };
}

// Event Message Patterns
export const EventPatterns = {
  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DEACTIVATED: 'user.deactivated',
  
  // Post events
  POST_CREATED: 'post.created',
  POST_PUBLISHED: 'post.published',
  POST_DELETED: 'post.deleted',
  
  // Auth events
  USER_REGISTERED: 'auth.user.registered',
  USER_LOGIN: 'auth.user.login',
} as const;