# CDH Project Makefile

.PHONY: help dev build test lint format clean install deploy

# Default target
help:
	@echo "CDH Project Tasks"
	@echo "=================="
	@echo "Development:"
	@echo "  make dev        - Start development server"
	@echo "  make dev-safe   - Start dev server (clean)"
	@echo "  make install    - Install dependencies"
	@echo ""
	@echo "Building:"
	@echo "  make build      - Build for production"
	@echo "  make start      - Start production server"
	@echo ""
	@echo "Testing:"
	@echo "  make test       - Run all tests"
	@echo "  make test-watch - Run tests in watch mode"
	@echo "  make test-ui    - Run tests with UI"
	@echo "  make coverage   - Generate coverage report"
	@echo "  make e2e        - Run E2E tests"
	@echo ""
	@echo "Quality:"
	@echo "  make lint       - Run linter"
	@echo "  make format     - Format code"
	@echo "  make typecheck  - Check TypeScript types"
	@echo "  make quality    - Run all quality checks"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make reset      - Reset project (clean + install)"
	@echo "  make backup     - Create project backup"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy     - Deploy to production"
	@echo "  make docker     - Build Docker image"

# Development tasks
dev:
	npm run dev

dev-safe:
	npm run devsafe

install:
	npm install

# Build tasks
build:
	npm run build

start:
	npm run start

# Testing tasks
test:
	npm run test

test-watch:
	npm run test:watch

test-ui:
	npm run test:ui

coverage:
	npm run coverage

e2e:
	npm run test:e2e

# Quality tasks
lint:
	npm run lint

format:
	npm run format

typecheck:
	npx tsc --noEmit

quality: lint format typecheck test
	@echo "All quality checks completed!"

# Maintenance tasks
clean:
	rm -rf .next
	rm -rf dist
	rm -rf coverage

reset: clean
	rm -rf node_modules
	rm -f package-lock.json
	npm install

backup:
	tar -czf "../cdh-backup-$$(date +%Y%m%d-%H%M%S).tar.gz" . \
		--exclude=node_modules \
		--exclude=.next \
		--exclude=dist \
		--exclude=coverage

# Deployment tasks
deploy: quality build
	@echo "Ready for deployment!"
	@echo "Run deployment commands here"

docker:
	docker build -t cdh:latest .

# Parallel execution
parallel-dev:
	make -j4 typecheck lint test build

parallel-quality:
	make -j3 lint format typecheck
