const prisma = require('../config/prisma');

/**
 * @route   POST /api/requests
 * @desc    Create a new request
 * @access  Private (SATELLITE_OPERATOR)
 */
exports.createRequest = async (req, res) => {
  const { type, justification, products } = req.body;
  const { id: requesterId, warehouseId: originWarehouseId } = req.user;

  try {
    if (!originWarehouseId) {
        return res.status(400).json({ message: 'User is not associated with a warehouse.' });
    }

    const newRequest = await prisma.request.create({
      data: {
        type,
        justification,
        products, // products is a JSON field, expecting an array of objects
        requesterId,
        originWarehouseId,
      },
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   GET /api/requests/my-requests
 * @desc    Get all requests for the logged-in satellite operator
 * @access  Private (SATELLITE_OPERATOR)
 */
exports.getMyRequests = async (req, res) => {
  const { id: requesterId } = req.user;

  try {
    const requests = await prisma.request.findMany({
      where: { requesterId },
      include: { originWarehouse: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   GET /api/requests
 * @desc    Get all requests (for central manager)
 * @access  Private (CENTRAL_MANAGER)
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      include: { requester: { select: { name: true } }, originWarehouse: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   PUT /api/requests/:id/status
 * @desc    Update the status of a request
 * @access  Private (CENTRAL_MANAGER)
 */
exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status },
    });

    // Optional: Add logic here to adjust inventory if status is 'APPROVED' and then 'COMPLETED'

    res.json(updatedRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
