CREATE TABLE quotes_history (
    id BIGSERIAL,
    created_at timestamp,
    instrument VARCHAR(64),
    bid DECIMAL(18, 6),
    ask DECIMAL(18, 6)
);