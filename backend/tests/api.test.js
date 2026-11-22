const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const app = require('../src/app');
const errorHandler = require('../src/middlewares/errorHandler');

describe('StockFlow Backend Test Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it('GET /api/health should return 200 with status ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.message, 'StockFlow API is running');
  });

  it('GET /api/unknown-route should return 404 with Route not found error', async () => {
    const res = await fetch(`${baseUrl}/api/unknown-route`);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.deepEqual(data, { error: 'Route not found' });
  });

  it('POST /invalid/path should return 404 with Route not found error', async () => {
    const res = await fetch(`${baseUrl}/invalid/path`, { method: 'POST' });
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.deepEqual(data, { error: 'Route not found' });
  });

  it('errorHandler should return 400 for SequelizeValidationError', () => {
    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };
    const mockErr = {
      name: 'SequelizeValidationError',
      message: 'Validation failed',
      errors: [{ message: 'Validation isInt on quantityOnHand failed' }],
    };
    errorHandler(mockErr, {}, mockRes, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonBody.error, 'Validation isInt on quantityOnHand failed');
  });

  it('errorHandler should return 400 for SequelizeUniqueConstraintError', () => {
    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };
    const mockErr = {
      name: 'SequelizeUniqueConstraintError',
      message: 'Unique constraint error',
      errors: [{ message: 'SKU must be unique' }],
    };
    errorHandler(mockErr, {}, mockRes, () => {});
    assert.equal(statusCode, 400);
    assert.equal(jsonBody.error, 'SKU must be unique');
  });

  it('auth middleware should reject requests without token', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.error, 'Authorization header missing');
  });

  it('should enforce JWT secret requirement when in production', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;
    const originalKey = process.env.jwt_secret_key;

    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    delete process.env.jwt_secret_key;

    try {
      assert.throws(
        () => {
          delete require.cache[require.resolve('../src/middlewares/authMiddleware')];
          require('../src/middlewares/authMiddleware');
        },
        {
          name: 'Error',
          message: 'JWT secret must be configured in production environment',
        }
      );
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalSecret !== undefined) process.env.JWT_SECRET = originalSecret;
      if (originalKey !== undefined) process.env.jwt_secret_key = originalKey;
      delete require.cache[require.resolve('../src/middlewares/authMiddleware')];
      require('../src/middlewares/authMiddleware');
    }
  });

  it('should enforce JWT secret requirement in authController when in production', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;
    const originalKey = process.env.jwt_secret_key;

    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    delete process.env.jwt_secret_key;

    try {
      assert.throws(
        () => {
          delete require.cache[require.resolve('../src/controllers/authController')];
          require('../src/controllers/authController');
        },
        {
          name: 'Error',
          message: 'JWT secret must be configured in production environment',
        }
      );
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalSecret !== undefined) process.env.JWT_SECRET = originalSecret;
      if (originalKey !== undefined) process.env.jwt_secret_key = originalKey;
      delete require.cache[require.resolve('../src/controllers/authController')];
      require('../src/controllers/authController');
    }
  });

  it('adjustStock should reject invalid adjustment delta with 400', async () => {
    const { adjustStock } = require('../src/controllers/productController');
    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };
    await adjustStock(
      { organizationId: 'test-org', params: { id: 'test-id' }, body: { adjustment: 'invalid' } },
      mockRes
    );
    assert.equal(statusCode, 400);
    assert.equal(jsonBody.error, 'A valid adjustment quantity is required');
  });

  it('adjustStock should return 401 when organization context is missing', async () => {
    const { adjustStock } = require('../src/controllers/productController');
    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };
    await adjustStock(
      { params: { id: 'test-id' }, body: { adjustment: 5 } },
      mockRes
    );
    assert.equal(statusCode, 401);
    assert.equal(jsonBody.error, 'Organization context missing');
  });

  it('adjustStock should return 404 when product is not found', async () => {
    const { adjustStock } = require('../src/controllers/productController');
    const { Product, sequelize } = require('../src/models');
    const origTx = sequelize.transaction;
    sequelize.transaction = async (cb) => {
      return cb({ LOCK: { UPDATE: 'UPDATE' } });
    };
    const origFindOne = Product.findOne;
    Product.findOne = async () => null;

    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };

    try {
      await adjustStock(
        { organizationId: 'org-1', params: { id: 'nonexistent-id' }, body: { adjustment: 5 } },
        mockRes
      );
      assert.equal(statusCode, 404);
      assert.equal(jsonBody.error, 'Product not found');
    } finally {
      sequelize.transaction = origTx;
      Product.findOne = origFindOne;
    }
  });

  it('adjustStock should reject adjustment resulting in negative stock with 400', async () => {
    const { adjustStock } = require('../src/controllers/productController');
    const { Product, sequelize } = require('../src/models');
    const origTx = sequelize.transaction;
    sequelize.transaction = async (cb) => {
      return cb({ LOCK: { UPDATE: 'UPDATE' } });
    };
    const origFindOne = Product.findOne;
    Product.findOne = async () => ({
      id: 'prod-1',
      organizationId: 'org-1',
      quantityOnHand: 3,
    });

    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };

    try {
      await adjustStock(
        { organizationId: 'org-1', params: { id: 'prod-1' }, body: { adjustment: -5 } },
        mockRes
      );
      assert.equal(statusCode, 400);
      assert.equal(jsonBody.error, 'Stock quantity cannot fall below 0');
      assert.equal(jsonBody.currentQuantity, 3);
    } finally {
      sequelize.transaction = origTx;
      Product.findOne = origFindOne;
    }
  });

  it('adjustStock should succeed with valid positive delta', async () => {
    const { adjustStock } = require('../src/controllers/productController');
    const { Product, Setting, sequelize } = require('../src/models');
    const origTx = sequelize.transaction;
    sequelize.transaction = async (cb) => {
      return cb({ LOCK: { UPDATE: 'UPDATE' } });
    };
    const origFindOne = Product.findOne;
    const origSettingFind = Setting.findOne;
    let saved = false;
    Product.findOne = async () => ({
      id: 'prod-1',
      organizationId: 'org-1',
      name: 'Widget',
      quantityOnHand: 10,
      lowStockThreshold: 5,
      save: async () => {
        saved = true;
      },
      toJSON() {
        return { id: this.id, name: this.name, quantityOnHand: this.quantityOnHand, lowStockThreshold: this.lowStockThreshold };
      },
    });
    Setting.findOne = async () => ({ defaultLowStockThreshold: 5 });

    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };

    try {
      await adjustStock(
        { organizationId: 'org-1', params: { id: 'prod-1' }, body: { adjustment: 7 } },
        mockRes
      );
      assert.equal(statusCode, 200);
      assert.equal(saved, true);
      assert.equal(jsonBody.product.quantityOnHand, 17);
      assert.equal(jsonBody.product.isLowStock, false);
    } finally {
      sequelize.transaction = origTx;
      Product.findOne = origFindOne;
      Setting.findOne = origSettingFind;
    }
  });

  it('dashboard overview should return 401 when organization context is missing', async () => {
    const { getDashboardOverview } = require('../src/controllers/dashboardController');
    let statusCode;
    let jsonBody;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        jsonBody = body;
        return this;
      },
    };
    await getDashboardOverview({}, mockRes);
    assert.equal(statusCode, 401);
    assert.equal(jsonBody.error, 'Organization context missing');
  });
});
