-- ============================================================
-- Block 17-A-3.2: Auto-expire pickup reservations after 48h
-- Apply this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Add audit columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- 2. Create (or replace) the expiration function
CREATE OR REPLACE FUNCTION expire_pickup_reservations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_order RECORD;
  order_item RECORD;
BEGIN
  FOR expired_order IN
    SELECT id, created_at
    FROM orders
    WHERE payment_method = 'cash_on_pickup'
      AND status = 'pending_payment'
      AND created_at < NOW() - INTERVAL '48 hours'
  LOOP
    -- Cancel the order
    UPDATE orders
    SET
      status = 'cancelled',
      cancellation_reason = 'expired_reservation',
      cancelled_at = NOW()
    WHERE id = expired_order.id;

    -- Release reserved stock for each item
    FOR order_item IN
      SELECT product_id, quantity
      FROM order_items
      WHERE order_id = expired_order.id
    LOOP
      UPDATE inventory
      SET
        reserved_qty = GREATEST(0, reserved_qty - order_item.quantity),
        quantity = quantity + order_item.quantity
      WHERE product_id = order_item.product_id;
    END LOOP;

    -- Mark inventory_reservations as cancelled
    UPDATE inventory_reservations
    SET
      status = 'cancelled',
      updated_at = NOW()
    WHERE order_id = expired_order.id
      AND status = 'active';

    RAISE NOTICE 'Expired reservation: order_id=%, created_at=%', expired_order.id, expired_order.created_at;
  END LOOP;
END;
$$;

-- 3. Schedule via pg_cron (runs every hour at minute 0)
--    cron.schedule upserts by name — safe to re-run
SELECT cron.schedule(
  'expire-pickup-reservations',
  '0 * * * *',
  $$ SELECT expire_pickup_reservations(); $$
);

-- ============================================================
-- TESTING (run manually in SQL Editor after applying above)
-- ============================================================
-- Step 1: Find a cash_on_pickup order and note its ID
-- SELECT id, status, created_at FROM orders
--   WHERE payment_method = 'cash_on_pickup' LIMIT 5;

-- Step 2: Backdate it to simulate expiration
-- UPDATE orders SET created_at = NOW() - INTERVAL '49 hours'
--   WHERE id = '<your-order-id>';

-- Step 3: Trigger the function
-- SELECT expire_pickup_reservations();

-- Step 4: Verify results
-- SELECT id, status, cancellation_reason, cancelled_at
--   FROM orders WHERE id = '<your-order-id>';
-- ============================================================
