<?php
namespace MDT\MobileApi\Models\Building;

/**
 * @license  http://www.apache.org/licenses/LICENSE-2.0
 *           Copyright [2014] [Robert Allen]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @category Swagger
 * @package  Swagger
 */
require dirname(__DIR__) . '/vendor/autoload.php';

use Symfony\Component\Finder\Finder;

/**
 * @SWG\Resource(
 * basePath="/",
 * description="Approvals"
 * )
 */
class Approval extends MobileApiController
{


    /**
     * @SWG\Api(
     * path="/log/render/{type}",
     * @SWG\Operation(
     * method="GET",
     * type="AccessLog",
     * summary="This call returns a json array of log entries",
     * nickname="log/render",
     * @SWG\Parameter(
     * name="type",
     * description="Number of records to return",
     * enum="['slow', 'count']",
     * paramType="path",
     * type="string",
     * defaultValue="slow"
     * ),
     * @SWG\Parameter(
     * name="duration",
     * description="Number of hours to collect data from, can be string or int",
     * enum="['hour', 'day', 'week', 'month']",
     * paramType="query",
     * type="string",
     * defaultValue="day"
     * )
     * )
     * )
     */
    public function getRender($params) {

        /**
        * something here to be left alone @ )
        */

    }
    }


    class BuildingImageModel extends MobileApiModel {

          /**
           * @return string
           */
          public function getIdFieldName()
          {
              return 'id';
          }

    }


    /**
     * @SWG\Api(
     * path="/gh/gifts/{id}",
     * @SWG\Operation(
     * method="DELETE",
     * summary="This call deletes a gift",
     * nickname="gh/DeleteGift",
     * @SWG\Parameter(
     * name="id",
     * description="id",
     * paramType="path",
     * type="integer",
     * defaultValue="1"
     * )
     * )
     * )
     */
    public function deleteGiftById($params)
    {


class BuildingImageModel extends MobileApiModel {

      /**
       * @return string
       */
      public function getIdFieldName()
      {
          return 'id';
      }

}
