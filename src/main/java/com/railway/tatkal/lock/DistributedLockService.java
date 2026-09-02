package com.railway.tatkal.lock;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.UUID;

@Service
public class DistributedLockService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final String UNLOCK_SCRIPT = """
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end
            """;

    public DistributedLockService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String tryLock(String key, Duration ttl) {
        String token = UUID.randomUUID().toString();

        Boolean acquired = redisTemplate
                .opsForValue()
                .setIfAbsent(key, token, ttl);

        if (Boolean.TRUE.equals(acquired)) {
            return token;
        }

        return null;
    }

    public void unlock(String key, String token) {
        DefaultRedisScript<Long> script =
                new DefaultRedisScript<>(UNLOCK_SCRIPT, Long.class);

        redisTemplate.execute(
                script,
                Collections.singletonList(key),
                token
        );
    }
}